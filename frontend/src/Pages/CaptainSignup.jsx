import  { useReducer, useContext, useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

/** Axios instance with fallback base URL */
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
})

/** Vehicle type options */
const VEHICLE_TYPES = [
  { value: 'car', label: 'Car' },
  { value: 'auto', label: 'Auto' },
  { value: 'moto', label: 'Moto' },
]



/** Initial form state */
const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  vehicleColor: '',
  vehiclePlate: '',
  vehicleCapacity: '',
  vehicleType: '',
}

/** Reducer to manage form state */
function reducer(state, action){
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const CaptainSignup = () => {
  const navigate = useNavigate()
  const {  setCaptain } = useContext(CaptainDataContext)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = useCallback(
    (e) => {
      dispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.value })
    },
    []
  )

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault()
      setError(null)

      // Basic validation example
      if (!state.email.includes('@')) {
        setError('Please enter a valid email.')
        return
      }
      if (state.password.length < 6) {
        setError('Password should be at least 6 characters.')
        return
      }

      const captainData = {
        fullname: {
          firstname: state.firstName.trim(),
          lastname: state.lastName.trim(),
        },
        email: state.email.trim(),
        password: state.password,
        vehicle: {
          color: state.vehicleColor.trim(),
          plate: state.vehiclePlate.trim(),
          capacity: state.vehicleCapacity,
          vehicleType: state.vehicleType,
        },
      }

      try {
        setLoading(true)
        const response = await api.post('/captains/register', captainData)

        if (response.status === 201) {
          const data = response.data
          setCaptain(data.captain)
          localStorage.setItem('token', data.token)
          dispatch({ type: 'RESET' }) // reset form only after success
          navigate('/captain-home')
        } else {
          setError('Unexpected response from server. Please try again.')
        }
      } catch (err) {
        // Better error extraction depending on API shape
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Registration failed. Please check your inputs and try again.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    },
    [state, navigate, setCaptain]
  )

  return (
    <div className="py-5 px-5 min-h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-20 mb-3"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="Captain icon"
        />

        <form onSubmit={submitHandler} noValidate>
          <h3 className="text-lg w-full font-medium mb-2">
            What's our Captain's name
          </h3>

          <div className="flex gap-4 mb-7">
            <div className="w-1/2">
              <label className="sr-only" htmlFor="firstName">
                First name
              </label>
              <input
                required
                id="firstName"
                name="firstName"
                aria-label="First name"
                className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="text"
                placeholder="First name"
                value={state.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label className="sr-only" htmlFor="lastName">
                Last name
              </label>
              <input
                required
                id="lastName"
                name="lastName"
                aria-label="Last name"
                className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="text"
                placeholder="Last name"
                value={state.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3 className="text-lg font-medium mb-2">
            What's our Captain's email
          </h3>
          <div className="mb-7">
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              required
              id="email"
              name="email"
              aria-label="Email"
              value={state.email}
              onChange={handleChange}
              className="bg-[#eeeeee] rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              type="email"
              placeholder="email@example.com"
            />
          </div>

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <div className="relative mb-7">
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              required
              id="password"
              name="password"
              aria-label="Password"
              className="bg-[#eeeeee] rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              type={showPassword ? 'text' : 'password'}
              placeholder="password"
              value={state.password}
              onChange={handleChange}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
          <div className="flex gap-4 mb-7">
            <div className="w-1/2">
              <label className="sr-only" htmlFor="vehicleColor">
                Vehicle Color
              </label>
              <input
                required
                id="vehicleColor"
                name="vehicleColor"
                aria-label="Vehicle Color"
                className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="text"
                placeholder="Vehicle Color"
                value={state.vehicleColor}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label className="sr-only" htmlFor="vehiclePlate">
                Vehicle Plate
              </label>
              <input
                required
                id="vehiclePlate"
                name="vehiclePlate"
                aria-label="Vehicle Plate"
                className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="text"
                placeholder="Vehicle Plate"
                value={state.vehiclePlate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-4 mb-7">
            <div className="w-1/2">
              <label className="sr-only" htmlFor="vehicleCapacity">
                Vehicle Capacity
              </label>
              <input
                required
                id="vehicleCapacity"
                name="vehicleCapacity"
                aria-label="Vehicle Capacity"
                className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="number"
                placeholder="Vehicle Capacity"
                value={state.vehicleCapacity}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label className="sr-only" htmlFor="vehicleType">
                Vehicle Type
              </label>
              <select
                required
                id="vehicleType"
                name="vehicleType"
                aria-label="Vehicle Type"
                className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg"
                value={state.vehicleType}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Vehicle Type
                </option>
                {VEHICLE_TYPES.map((vt) => (
                  <option key={vt.value} value={vt.value}>
                    {vt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-3 text-red-600 text-sm" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg"
          >
            {loading ? 'Creating account...' : 'Create Captain Account'}
          </button>
        </form>

        <p className="text-center">
          Already have an account?{' '}
          <Link to="/captain-login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>

      <div>
        <p className="text-[10px] mt-6 leading-tight">
          This site is protected by reCAPTCHA and the{' '}
          <span className="underline">Google Privacy Policy</span> and{' '}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  )
}

export default CaptainSignup
