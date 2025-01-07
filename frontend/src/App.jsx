
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import UserSignup from './Pages/UserSignup'
import UserLogin from './Pages/UserLogin'
import CaptainSignup from './Pages/CaptainSignup'
import CaptainLogin from './Pages/CaptainLogin.jsx'



function App() {

  return (
    <>
    <Routes >
      
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/captainsignup" element={<CaptainSignup />} />
      <Route path="/captainlogin" element={<CaptainLogin />} />

    </Routes>
    </>
  )
}

export default App
