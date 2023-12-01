import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' Component={SignUp}/>
      <Route path='/signin' Component={SignIn}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
