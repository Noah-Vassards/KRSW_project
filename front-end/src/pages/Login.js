import { useMemo, useState } from "react";
import Cookies from "js-cookie";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../App.css";

async function SendForm(email, password) {
  console.log('here')
  try {
    const response = await fetch('http://localhost:3001/account/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    if (response.status !== 201) {
      const message = await response.json().then(json => json)
      console.error('failed', message.message)
      return false
    } else {
      return true
    }
  } catch (e) {
    console.error(e)
    return (false)
  }
}

function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState(true)
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await SendForm(email, pass);
      if (result) {
        console.log('success')
        Cookies.set('userEmail', email, { expires: 7 })
        console.log(Cookies.get('userEmail'))
        navigate('/')
      } else {
        console.log('user false')
        setUser(false)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setUser(false)
    }
  }

  const emptyInput = useMemo(() => {
    return email.trim() === "" || pass.trim() === ""
  }, [email, pass])

  return (
    <div className="App">
      <header className="App-header">
        <label className='head'>KRSW Project</label>
      </header>
      <div className='App-Body' onSubmit={handleSubmit}>
        <form className='Form-Block'>
          <label className="Title">Login</label>
          <input type='text' placeholder={"Enter your email"} value={email} onInput={e => setEmail(e.target.value)}></input>
          <input type='password' placeholder={"Enter your password"} value={pass} onInput={e => setPass(e.target.value)}></input>
          {!user ? <label className="alert">User unknown</label> : null}
          <button type='submit' disabled={emptyInput}>Sign up</button>
          <label><Link className="redirect" to="/signup">Sign up</Link> instead</label>
        </form>
      </div>
      <Outlet />
    </div>
  );
}

export default Login