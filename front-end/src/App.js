import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Home from './pages/Home';
import Quizz from './pages/Quizz'
import Recommendations from './pages/Recommendations';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' Component={Home}/>
      <Route path='/signup' Component={SignUp}/>
      <Route path='/login' Component={Login}/>
      <Route path='/recommendations' Component={Recommendations}/>
      <Route path='/quizz' Component={Quizz}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
