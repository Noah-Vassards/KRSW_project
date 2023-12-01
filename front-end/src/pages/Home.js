import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
    const navigate = useNavigate()
    let userEmail = null

    useEffect(() => {
        userEmail = Cookies.get('userEmail')
        console.log(userEmail)
        if (!userEmail) {
            navigate('/login')
        }
    }, [navigate, userEmail])

    return (
        <div className="App">

        </div>
    );
}

export default Home