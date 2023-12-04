import Cookies from "js-cookie";
import { useMemo, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../App.css";

async function SendForm(email, password) {
  console.log('here')
  try {
    const response = await fetch('http://localhost:3001/account/signup', {
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

function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confPass, setConfPass] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await SendForm(email, pass);
      if (result) {
        Cookies.set('userEmail', email, { expires: 7 })
        navigate('/')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const validateEmail = useMemo(() => {
    const pattern = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
    const result = pattern.test(email.trim());
    return result
  }, [email])

  const validatePass = useMemo(() => {
    const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/
    const result = pattern.test(pass.trim())
    return pass.trim().length >= 8 && result
  }, [pass])

  const passMatch = useMemo(() => {
    return pass.trim() === confPass.trim()
  }, [pass, confPass])

  const canSubmit = useMemo(() => {
    return validateEmail && validatePass && passMatch;
  }, [validateEmail, validatePass, passMatch])

  return (
    <div className="App">
      <header className="App-header">
        <label className='head'>KRSW Project</label>
      </header>
      <div className='App-Body'>
        <form className='Form-Block' onSubmit={handleSubmit}>
          <label className="Title">Sign up</label>
          <input type='text' placeholder={"Enter your email"} value={email} onInput={e => setEmail(e.target.value)}></input>
          {!validateEmail ? <label className="alert">email format incorrect</label> : null}
          
          <input type='password' placeholder={"Enter your password"} value={pass} onInput={e => setPass(e.target.value)}></input>
          {!validatePass ? <label className="alert">password should be at least 8 character long with at least one digit and one character</label> : null}
          
          <input type='password' placeholder={"Confirm your password"} value={confPass} onInput={e => setConfPass(e.target.value)}></input>
          {!passMatch ? <label className="alert">password do not match</label> : null}
          
          <button type='submit' disabled={!canSubmit}>Sign up</button>
          <label><Link className="redirect" to="/login">Login</Link> instead</label>
        </form>
      </div>
      <Outlet />
    </div>

  );
}

export default SignUp