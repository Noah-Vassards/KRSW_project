import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import profile from "../profile-icon.png";
import "../App.css";

function Vignette(props) {
    return (
        <div>
            <div className="Affiche">
                <img src={props.image} alt="image" width="180" height="240" />
            </div>
            <label className="Match">Match {props.match}%</label>
        </div>
    )
}

const getRecommendations = async () => {
    try {
        const response = await fetch('http://localhost:3002/getReco/' + Cookies.get('userEmail'))

        if (response.status !== 200) {
            return []
        } else {
            const data = await response.json()
            return data
        }
    } catch (e) {
        console.log(e)
        return []
    }
}

function Recommendations() {
    const navigate = useNavigate()
    const [max, setMax] = useState(5)
    const [resizedArr, setResizedArr] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const isMounted = useRef(false)

    useEffect(() => {
        const fetchData = async () => {
            const userEmail = Cookies.get('userEmail')
            console.log(userEmail)
            if (!userEmail) {
                navigate('/login')
            }

            const recommendations = await getRecommendations()
            console.log(recommendations)

            if (!recommendations) {
                console.log('if')
                navigate('/login')
            } else {
                console.log('here')
                console.log(recommendations)
                setRecommendations(recommendations)
            }
        }

        if (!isMounted.current) {
            fetchData();
            isMounted.current = true;
        }
    })

    useEffect(() => {
        setResizedArr(recommendations.slice(0, max))
    }, [max, recommendations])

    const handleSeeMore = () => {
        if (max + 5 > recommendations.length) {
            setMax(recommendations.length)
        } else {
            setMax(max + 5)
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
                    {resizedArr.map((movie, index) => <Vignette key={index} match={movie['user:Rating']} image={movie['movie:thumbnail']} />)}
                    {recommendations.length > max ? <button className="Affiche" onClick={handleSeeMore}>
                        <label id="Add-Movie">See more</label>
                    </button> : null}
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default Recommendations