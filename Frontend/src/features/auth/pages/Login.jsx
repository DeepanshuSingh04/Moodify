import React from 'react'
import '../style/login.scss'
import FormGroup from '../components/FormGroup'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'


const Login = () => {

  const { loading, handleLogin} = useAuth()

  const navigate = useNavigate()   // used to navigate to another page after login

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    await handleLogin({ email, password })
    navigate('/')
  }

  return (
    <main className='login-page'>
      <div className='form-container'>
        <div className='form-side'>
          <h1>Login</h1>
          <p className='subtitle'>Enter your credentials to get in</p>
          <form onSubmit={handleSubmit}>
            <FormGroup 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            label='Email' 
            placeholder='Enter your email' 
            />
            <FormGroup 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            label='Password' 
            placeholder='Enter your password' 
            />
            <button className='button' type='submit'>Login</button>
          </form>

          <p className='switch-link'>
            Not a member? <Link to='/register'>Create an account</Link>
          </p>
        </div>

        <div className='visual-side'>
          <div className='visual-text'>
            <h2>Feel the beat, <strong>find your mood</strong></h2>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login