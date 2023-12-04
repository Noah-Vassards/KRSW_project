import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../App.css";
import profile from "../profile-icon.png"

function VignetteMenu(props) {
    const handleButtonClick = () => {
        props.onClose()
    }
    console.log(props.selectedVignette)
    return (
        <div className="Popup-Wrapper">
            <div className="Vignette-Popup">
                <button onClick={handleButtonClick}>Close</button>
            </div>
        </div>
    )
}

function Vignette(props) {
    return (
        <div>
            <div className="Affiche" onClick={() => props.onClick(props)}>
                <img className="rounded" src={props.image} alt="test" width="180" height="240" />
            </div>
            <label>{'⭐'.repeat(props.rank)}</label>
        </div>
    )
}

function Home() {
    const navigate = useNavigate()
    const [showMenu, setShowMenu] = useState(false)
    const [selectedVignette, setSelectedVignette] = useState(null)
    let userEmail = null

    const movies = [
        { rank: 5, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 3, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 4, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
        { rank: 1, image: "https://fr.web.img2.acsta.net/pictures/22/07/22/15/00/2862661.jpg" },
    ].sort((a, b) => { return b.rank - a.rank })

    useEffect(() => {
        userEmail = Cookies.get('userEmail')
        if (!userEmail) {
            navigate('/login')
        }
    }, [navigate, userEmail])

    useEffect(() => {
        console.log(showMenu)
    }, [showMenu])

    return (
        <div className="App">
            <header className="App-header">
                <div className="Header Nav-Bar">
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
                    {showMenu ? <VignetteMenu selectedVignette={selectedVignette} onClose = {() => {setShowMenu(false); setSelectedVignette(null)}}/> : null}
                    <button className="Affiche">
                        <label id="Add-Movie">Add movie</label>
                    </button>
                    {movies.map((movie, index) => <Vignette key={index} rank={movie.rank} image={movie.image} onClick={(vignetteProps) => { setShowMenu(true); setSelectedVignette(vignetteProps) }}  />)}
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default Home