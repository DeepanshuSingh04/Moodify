import React, {useState} from 'react'
import '../style/register.scss'
import FormGroup from '../components/FormGroup'
import {Link} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()   // used to navigate to another page after register

  const { loading, handleRegister} = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()

    await handleRegister({ username, email, password })

    navigate('/')
  }


  return (
    <main className='register-page'>
      <div className='form-container'>
        <div className='form-side'>
          <h1>Register</h1>
          <p className='subtitle'>Create your account to get started</p>
          <form onSubmit={handleSubmit}>
            <FormGroup 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            label='Username' 
            placeholder='Enter your username' 
            />
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
            <button className='button' type='submit'>Register</button>
          </form>

{/* ek page se dusre page pr jane ke liye link tag use kra hain         */}
          <p className='switch-link'>
            Already have an account? <Link to='/login'>Login here</Link>
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

export default Register
