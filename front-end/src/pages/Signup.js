import "../App.css"
import { Outlet, Link } from "react-router-dom";


function SignUp() {
  return (
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
          <label><Link className="redirect" to="/signin">Sign in</Link> instead</label>
        </form>
      </body>
      <Outlet />
    </div>

  );
}

export default SignUp