import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../App.css";

function Vignette(props) {
    return (
        <div>
            <div className="Affiche">
                <img src={props.image} alt="test" width="180" height="240" />
            </div>
            <label className="Match">Match {props.match}%</label>
        </div>
    )
}

function Recommendations() {
    const navigate = useNavigate()
    const [max, setMax] = useState(5)
    const [resizedArr, setResizedArr] = useState([])
    let userEmail = null

    const movies = [
        { match: 5, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 3, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 4, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { match: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
    ].sort((a, b) => { return b.rank - a.rank })

    useEffect(() => {
        userEmail = Cookies.get('userEmail')
        console.log(userEmail)
        if (!userEmail) {
            navigate('/login')
        }
    }, [navigate, userEmail])

    useEffect(() => {
        setResizedArr(movies.slice(0, max))
    }, [max])

    const handleSeeMore = () => {
        if (max + 5 > movies.length) {
            setMax(movies.length)
        } else {
            setMax(max + 5)
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <div className="Header Nav-Bar">
                    <Link className="Nav-Link" to="/">Watched movies</Link>
                    <Link className="Nav-Link focus" to="/">Recommendations</Link>
                    <Link className="Nav-Link" to="/">Quiz</Link>
                </div>
                <div className="Header Right">
                    <input type="input" placeholder="Search"></input>
                </div>
            </header>
            <div className="App-Body">
                <div className="Table">
                    {resizedArr.map((movie, index) => <Vignette key={index} match={movie.match} image={movie.image} />)}
                    <button className="Affiche" onClick={handleSeeMore}>
                        <label id="Add-Movie">See more</label>
                    </button>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default Recommendations