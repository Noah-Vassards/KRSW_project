import StarIcon from "@mui/icons-material/Star";
import { Rating } from "@mui/material";
import Cookies from "js-cookie";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../App.css";
import profile from "../profile-icon.png";
import debounce from "../utils/debounce";

const getMovieDetails = async (movieTitle) => {
    console.log('get movie details')
    const response = await fetch(`http://www.omdbapi.com/?apikey=85915a66&t=${movieTitle}`)

    if (response.status !== 200) {
        console.log('failed')
        return {}
    } else {
        const data = await response.json()
        console.log('data', data)
        const genre = data.Genre.split(', ')
        const thumbnail = data.Poster
        return { genre: genre, thumbnail: thumbnail }
    }
}

const sendNewMovie = async (movie) => {
    console.log('send new movie')
    const response = await fetch('http://localhost:3001/users/newMovie', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: Cookies.get('userEmail'),
            movie: {
                id: movie.uri,
                title: movie.title,
                actors: movie.actors,
                directors: movie.directors,
                rank: movie.rank,
                genre: movie.genre,
                thumbnail: movie.thumbnail
            }
        })
    })
    if (response.status !== 201) {
        console.log(response.status)
        return false
    } else {
        return true
    }
}

const getUserMovies = async () => {
    const response = await fetch('http://localhost:3001/users/movies?email=' + Cookies.get('userEmail'))
    const data = await response.json();
    if (response.status !== 200) {
        console.log(response.status)
        return false

    } else {
        console.log("success", response.status)
        console.log('data', data)
        return data
    }
}

const sparqlQueryMovie = (movieTitle) => `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    
    SELECT DISTINCT ?movie ?title (GROUP_CONCAT(DISTINCT ?director; separator=", ") AS ?directors) (GROUP_CONCAT(DISTINCT ?actor; separator=", ") AS ?actors)
    WHERE {
      ?movie rdf:type dbo:Film;
             rdfs:label ?title;
             dbo:director ?director;
             dbo:starring ?actor;
             dbo:gross ?grossLiteral.
      BIND(xsd:double(?grossLiteral) AS ?gross)
      FILTER (
        regex(?title, "${movieTitle}", "i") &&
        !contains(?title, "(")
      )
      FILTER(LANG(?title) = "en")
    }
    ORDER BY DESC(?gross)
    LIMIT 5
    `
const requestMovies = async (movieTitle) => {
    const response = await fetch(`http://dbpedia.org/sparql?query=${encodeURIComponent(sparqlQueryMovie(movieTitle))}&format=json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })

    const data = await response.json();
    if (response.status !== 200) {
        console.log(response.status)
        throw new Error(data.message)

    } else {
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('json')) {
            console.error('format', contentType)
            throw new Error('Error: Response is not JSON format')
        }
        console.log("success", response.status)
        console.log('data', data)
        const results = data.results.bindings.map((result) => { return { title: result.title.value, uri: result.movie.value, actors: result.actors.value.split(', '), directors: result.directors.value.split(', '), rank: 1 } })
        console.log('results', results)
        return results
    }
}

function AddMovie(props) {
    const [movieTitle, setMovieTitle] = useState('')
    const [movies, setMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState({})

    const closePopup = () => {
        props.onClose()
    }

    //eslint-disable-next-line
    const fetchMovies = useCallback(debounce(async (title) => {
        console.log('requestMovies')
        if (title.trim().length < 3) {
            setMovies([])
            return
        }
        try {
            const result = await requestMovies(title)
            setMovies(result)
        } catch (error) {
            console.error(error)
            setMovies([])
        }
    }, 100), [])


    return (
        <div className="Popup-Wrapper">
            <div className="Vignette-Popup">
                <button className="Close-Button" onClick={closePopup}>X</button>
                <div className="Popup-Body">
                    <div className="Movies-Wrapper">
                        <input type="text" className="Small" placeholder={"Enter film title"} value={movieTitle} onInput={e => { setMovieTitle(e.target.value); fetchMovies(movieTitle) }}></input>
                        {movies.length !== 0 ? <div className="Movies-Select">
                            {/* eslint-disable-next-line */}
                            {movies.map((movie, index) => <button className="Movie-Choice" key={index} onClick={() => { setSelectedMovie(movie), setMovies([]), setMovieTitle('') }}>{movie.title}</button>)}
                        </div> : null}
                        {Object.keys(selectedMovie).length !== 0 ?
                            <div className="Grid-Wrapper">
                                <div className="Movie-Infos">
                                    <div className="Title-Box" id="title">
                                        {selectedMovie.title}
                                    </div>
                                    <div className="Title-Box" id="actors">
                                        <label className="Body">Actors</label>
                                        <div className="Name-List">
                                            {selectedMovie.actors.map((actor, index) => {
                                                const splitURI = actor.split('/');
                                                return <label className="Body" key={index}>{splitURI[splitURI.length - 1].replaceAll('_', ' ')}</label>
                                            })}
                                        </div>
                                    </div>
                                    <div className="Title-Box" id="directors">
                                        <label className="Body">Director{selectedMovie.directors.length > 1 ? 's' : ''}</label>
                                        <div className="Name-List">
                                            {selectedMovie.directors.map((director, index) => {
                                                const splitURI = director.split('/');
                                                return <label className="Body" key={index}>{splitURI[splitURI.length - 1].replaceAll('_', ' ')}</label>
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="Rating">
                                    <label>Give a mark: </label>
                                    <Rating
                                        name="rank select"
                                        value={selectedMovie.rank}
                                        icon={<StarIcon fontSize="inherit" />}
                                        onChange={(event, newValue) => {
                                            setSelectedMovie({ ...selectedMovie, rank: newValue })
                                        }} />
                                </div>
                                <div className="Popup-Confirm-Button">
                                    <button className="Confirm-Button" onClick={() => { props.onSelectMovie(selectedMovie); closePopup() }}>Confirm</button>
                                </div>
                            </div> : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

function VignetteMenu(props) {
    const handleButtonClick = () => {
        props.onClose()
    }
    console.log(props.selectedVignette)
    return (
        <div className="Popup-Wrapper">
            <div className="Vignette-Popup">
                <div className="Header-Popup">
                    <div className="center">
                        <label className="Movie-Title">{props.selectedVignette.title}</label>
                    </div>
                    <div className="Right right">
                        <button onClick={handleButtonClick}>Close</button>
                    </div>
                </div>
                <div>
                    <Rating
                        name="rank select"
                        value={props.selectedVignette.rank}
                        onChange={(event, newValue) => {
                            const updatedVignette = { ...props.selectedVignette, rank: newValue };
                            props.onChange(updatedVignette);
                        }} />
                </div>
            </div>
        </div>
    )
}

function Vignette(props) {
    return (
        <div>
            <div className="Affiche" onClick={() => props.onClick(props.id)}>
                <img className="rounded" src={props.image} alt={props.title} width="180" height="240" />
            </div>
            <label>{'⭐'.repeat(props.rank)}</label>
        </div>
    )
}

function Home() {
    const navigate = useNavigate()
    const [showVignette, setShowVignette] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [selectedVignette, setSelectedVignette] = useState(null)
    const [movies, setMovies] = useState([])
    const isMounted = useRef(true)

    useEffect(() => {
        const init = async () => {
            console.log('here')
            const userEmail = Cookies.get('userEmail')
            if (!userEmail) {
                navigate('/login')
            }


            const userMovies = await getUserMovies()
            console.log(userMovies)
            if (!userMovies) {
                navigate('/login')
            } else {
                userMovies.sort((a, b) => b['user:Rating'] - a['user:Rating'])
                setMovies(userMovies)
            }
        }

        if (isMounted.current) {
            init()
        }

        return () => {
            isMounted.current = false
        }
    }, [])

    const getMovieById = () => {
        const movie = movies.find(obj => obj.id === selectedVignette)
        console.log("movie", movie)
        return movie
    }


    const handleVignetteChange = (updatedInfos) => {
        const updatedMovies = movies.map((movie) =>
            movie.id === updatedInfos.id ? updatedInfos : movie
        );
        setMovies(updatedMovies)
        console.log(movies)
    };

    const handleSelectMovie = async (newMovie) => {
        console.log('selected movie', newMovie)
        const found = movies.find(movie => movie.title === newMovie.title)
        console.log(found)
        const movieDetails = await getMovieDetails(newMovie.title)
        if (movieDetails.length === 0) {
            console.log('error')
            return
        }
        newMovie = { ...newMovie, ...movieDetails }
        console.log(newMovie)
        const res = await sendNewMovie(newMovie)
        if (!found && res) {
            const updatedMovies = [...movies, newMovie]
            setMovies(updatedMovies.sort((a, b) => a.rank - b.rank))
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <div className="Header Nav-Bar top">
                    <Link className="Nav-Link focus" to="/">Watched movies</Link>
                    <Link className="Nav-Link" to="/recommendations">Recommendations</Link>
                    <Link className="Nav-Link" to="/quizz">Quiz</Link>
                </div>
                <div className="Header Right">
                    <input className="Small" type="text" placeholder="Search"></input>
                    <button className="transparent">
                        <img src={profile} alt="Profile" width="50" />
                    </button>
                </div>
            </header>
            <div className="App-Body">
                <div className="Table">
                    {showVignette ? <VignetteMenu selectedVignette={getMovieById()} onChange={(updatedInfos) => handleVignetteChange(updatedInfos)} onClose={() => { setShowVignette(false); console.log(getMovieById(selectedVignette).rank); setSelectedVignette(null) }} /> : null}
                    {showMenu ? <AddMovie selectedVignette={movies[0]} onChange={(updatedInfos) => handleVignetteChange(updatedInfos)} onClose={() => setShowMenu(false)} onSelectMovie={(movie) => handleSelectMovie(movie)} /> : null}
                    <button className="Affiche" onClick={() => setShowMenu(true)}>
                        <label id="Add-Movie">Add movie</label>
                    </button>
                    {movies.map((movie, index) => <Vignette key={index} id={movie.id} title={movie.title || movie['dbo:title']} rank={movie.rank || movie['user:Rating']} image={movie.thumbnail || movie['movie:thumbnail']} onClick={(vignetteKey) => { setShowVignette(true); setSelectedVignette(vignetteKey) }} />)}
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default Home