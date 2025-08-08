import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const newUser = {
        fullname: {
          firstname: formData.firstName,
          lastname: formData.lastName
        },
        email: formData.email,
        password: formData.password
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

      if (response.status === 201) {
        const { user, token } = response.data
        setUser(user)
        localStorage.setItem('token', token)
        navigate('/home')
      }
    } catch (err) {
      console.error(err)
      setError('Signup failed. Please try again.')
    } finally {
      setLoading(false)
      setFormData({ firstName: '', lastName: '', email: '', password: '' })
    }
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="logo" />

        <form onSubmit={handleSubmit}>
          <h3 className='text-lg font-medium mb-2'>What's your name</h3>
          <div className='flex gap-4 mb-7'>
            <input
              required
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              placeholder='First name'
            />
            <input
              required
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              placeholder='Last name'
            />
          </div>

          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input
            required
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            placeholder='password'
          />

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <button
            disabled={loading}
            className={`bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className='text-center'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600'>Login here</Link>
        </p>
      </div>

      <p className='text-[10px] leading-tight'>
        This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service</span> apply.
      </p>

      
    </div>
  )
}

export default UserSignup
