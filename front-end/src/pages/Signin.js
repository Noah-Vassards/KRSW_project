import "../App.css"
import { Outlet, Link } from "react-router-dom";


function SignIn() {
  return (
    <div className="App">
      <div className="App">
        <header className="App-header">
          <label className='title'>KRSW Project</label>
        </header>
        <body className='App-Body'>
          <form className='Form-Block'>
            <label>Sign In</label>
            <input type='text' placeholder={"Submit"}></input>
            <input type='text' placeholder={"Submit"}></input>
            <input type='Submit'></input>
            <label><Link className="redirect" to="/">Sign up</Link> instead</label>
          </form>
        </body>
      </div>
      <Outlet />
    </div>
  );
}

export default SignIn