import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    const captain = { email, password };

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captain
      );

      if (response.status === 200) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            className="w-20"
            src="https://www.svgrepo.com/show/505031/uber-driver.svg"
            alt="Captain Logo"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">Captain Login</h2>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submitHandler}>
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-100 mb-5 rounded-lg px-4 py-2 border w-full text-base"
            type="email"
            placeholder="email@example.com"
          />

          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-100 mb-5 rounded-lg px-4 py-2 border w-full text-base"
            type="password"
            placeholder="password"
          />

          <button
            disabled={loading}
            className={`${
              loading ? "bg-gray-500" : "bg-black hover:bg-gray-800"
            } text-white font-semibold rounded-lg px-4 py-2 w-full text-lg transition`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Links */}
        <p className="text-center text-sm mt-4">
          Join a fleet?{" "}
          <Link to="/captain-signup" className="text-blue-600 hover:underline">
            Register as a Captain
          </Link>
        </p>
      </div>

      {/* Switch to User Login */}
      <Link
        to="/login"
        className="bg-orange-600 hover:bg-orange-700 flex items-center justify-center text-white font-semibold mt-6 rounded-lg px-4 py-2 w-full max-w-md text-lg transition"
      >
        Sign in as User
      </Link>
    </div>
  );
};

export default CaptainLogin;
