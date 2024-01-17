import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { createActorQuestion, createDirectorQuestion, CreateTitleQuestion } from '../questions'
import profile from "../profile-icon.png";

const resultSentence = [
    "Great effort! Whether high or low, keep enjoying the cinematic journey!",
    "Well done! You know your movies. Keep it up!",
    "Nice work! Your movie knowledge is on point.",
    "Fantastic! You scored high – a true movie maestro!",
]

const createQuestions = (movies, onClickFunc) => {
    console.log('movies', movies)
    const titles = movies.map((movie) => movie.title)
    const actors = movies.map((movie) => movie.actor).flat()
    const directors = movies.map((movie) => movie.director).flat()
    console.log('title', titles)
    console.log('directors', directors)
    console.log('actors', actors)
    const questions = movies.map((movie) => {
        const idx = Math.floor(Math.random() * 3)
        console.log(idx)
        if (idx === 0) {
            return CreateTitleQuestion(movie, titles.filter((title) => title !== movie.title).slice(0, 3), onClickFunc)
        } else if (idx === 1) {
            return createActorQuestion(movie, actors.filter((actor) => !movie.actor.includes(actor)).slice(0, 3), onClickFunc)
        }
        return createDirectorQuestion(movie, directors.filter((director) => !movie.director.includes(director)).slice(0, 3), onClickFunc)
    })
    console.log(questions)
    return questions
}

const notEnoughLabel = () => {
    return (
        <div>
            <label>There are not enough movies to create the quizz.<br />Please add more movies to your watch list</label>
        </div>
    )
}

const getUserMovies = async () => {
    const response = await fetch(`http://localhost:3001/users/movies?email=${Cookies.get('userEmail')}`)
    if (response.status !== 200) {
        console.log('failed')
        return []
    } else {
        const data = await response.json()
        const movies = data.map((movie) => { return ({ director: movie['dbo:director'], actor: movie['dbo:starring'], thumbnail: movie['movie:thumbnail'], title: movie['dbo:title'] }) })
        movies.sort((a, b) => 0.5 - Math.random())
        console.log('movies request', movies)
        movies.forEach(movie => {
            movie.actor = movie.actor.map((actor) => actor.replaceAll('_', ' ').split('/').pop())
            movie.director = movie.director.map((director) => director.replaceAll('_', ' ').split('/').pop())
        });
        return movies
    }
}

function Quizz() {
    const navigate = useNavigate()
    const [movies, setMovies] = useState([])
    const [questions, setQuestions] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState([])
    const isMounted = useRef(false)

    const getAnswerStatus = (status) => {
        setAnswers(prevAnswer => [...prevAnswer, status])
        setCurrentQuestion(prevAnswer => prevAnswer + 1)
    }

    useEffect(() => {
        const fetchData = async () => {
            console.log('useEffect')
            const userEmail = Cookies.get('userEmail')
            if (!userEmail) {
                navigate('/login')
                return;
            }

            const userMovies = await getUserMovies()
            console.log(userMovies)

            if (!userMovies) {
                console.log('if')
                navigate('/login')
            } else {
                console.log('here')
                console.log(userMovies)
                setMovies(userMovies)
                setQuestions(createQuestions(userMovies, getAnswerStatus))
            }
        }

        if (!isMounted.current) {
            fetchData();
            isMounted.current = true;
        }
    });

    useEffect(() => {
        console.log(answers)
    }, [answers])

    useEffect(() => {
        console.log(currentQuestion, questions.length)
    }, [currentQuestion])

    const endResults = () => {
        const score = Math.round((answers.reduce((a, b) => a + b, 0) / answers.length) * 100)

        return (
            <div>
                <label>You have a score of {score}%</label>
                <br />
                {score < 100 ? <label>{resultSentence[score % 4]}</label> : <label>Congratulations! A perfect 100%! You're a true cinema virtuoso – your movie knowledge is impeccable!</label>}
            </div>
        )
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
                {currentQuestion < questions.length ?
                    movies.length < 5 ? notEnoughLabel() : (
                        <div className="QuestionWrapper">
                            {/* {[questions[currentQuestion]].map((question, index) => {console.log(question); return <div key={index}>{question()}</div>})} */}
                            {<div>{questions[currentQuestion]}</div>}
                        </div>
                    ) : null}
                {currentQuestion === questions.length ? (
                    <div>
                        {endResults()}
                        {<button className="Again" onClick={() => window.location.reload()}>Try Again</button>}
                    </div>
                ) : null}

            </div>
        </div>
    )
}

export default Quizz