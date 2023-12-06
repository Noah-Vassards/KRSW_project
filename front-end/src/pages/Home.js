import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../App.css";
import profile from "../profile-icon.png"
import { Rating } from "@mui/material";
import debounce from "../utils/debounce";

const sparqlQueryMovie = (movieTitle) => `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    
    SELECT DISTINCT ?movie ?title (GROUP_CONCAT(?director; separator=", ") AS ?directors) (GROUP_CONCAT(?date; separator=", ") AS ?dates) (GROUP_CONCAT(?actor; separator=", ") AS ?actors)
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
        const results = data.results.bindings.map((result) => { return { title: result.title.value, uri: result.movie.value, actors: result.actors.value.split(', '), directors: result.directors.value.split(', ') } })
        console.log('results', results)
        return results
    }
}

function AddMovie(props) {
    const [movieTitle, setMovieTitle] = useState('')
    const [movies, setMovies] = useState([])

    const handleButtonClick = () => {
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

    useEffect(() => {
        fetchMovies(movieTitle);
    }, [movieTitle, fetchMovies])


    return (
        <div className="Popup-Wrapper">
            <div className="Vignette-Popup">
                <button onClick={handleButtonClick}>Close</button>
                <div className="Popup-Body">
                    <div className="Movies-Wrapper">
                        <input type="text" className="Small" placeholder={"Enter film title"} value={movieTitle} onInput={e => setMovieTitle(e.target.value)}></input>
                        {movies.length !== 0 ? <div className="Movies-Select">
                            {/* eslint-disable-next-line */}
                            {movies.map((movie, index) => <button className="Movie-Choice" key={index}>{movie.title}</button>)}
                        </div> : null}
                    </div>
                    <input type="text" className="Small"></input>
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
                <img className="rounded" src={props.image} alt="test" width="180" height="240" />
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

    let movies = [
        { id: 0, title: "title", rank: 5, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 1, title: "title", rank: 5, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 2, title: "title", rank: 3, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 3, title: "title", rank: 4, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 4, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 5, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 6, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 7, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 8, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 9, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 10, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 11, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 12, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 13, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 14, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 15, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 16, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 17, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 18, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 19, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 20, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 21, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 22, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 23, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 24, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { id: 25, title: "title", rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
    ].sort((a, b) => { return b.rank - a.rank })

    useEffect(() => {
        const userEmail = Cookies.get('userEmail')
        if (!userEmail) {
            navigate('/login')
        }
    }, [navigate])

    const getMovieById = () => {
        const movie = movies.find(obj => obj.id === selectedVignette)
        console.log("movie", movie)
        return movie
    }

    const handleVignetteChange = (updatedInfos) => {
        const updatedMovies = movies.map((movie) =>
            movie.id === updatedInfos.id ? updatedInfos : movie
        );
        movies = updatedMovies
        console.log(movies)
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="Header Nav-Bar top">
                    <Link className="Nav-Link focus" to="/">Watched movies</Link>
                    <Link className="Nav-Link" to="/recommendations">Recommendations</Link>
                    <Link className="Nav-Link" to="/">Quiz</Link>
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
                    {showMenu ? <AddMovie selectedVignette={movies[0]} onChange={(updatedInfos) => handleVignetteChange(updatedInfos)} onClose={() => setShowMenu(false)} /> : null}
                    <button className="Affiche" onClick={() => setShowMenu(true)}>
                        <label id="Add-Movie">Add movie</label>
                    </button>
                    {movies.map((movie) => <Vignette key={movie.id} id={movie.id} rank={movie.rank} image={movie.image} onClick={(vignetteKey) => { setShowVignette(true); setSelectedVignette(vignetteKey) }} />)}
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default Home