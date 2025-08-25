import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className="relative h-screen w-full bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3')]">
      
      
      <div className="absolute inset-0 bg-black/60" />

      {/* Logo */}
      <div className="relative z-10 p-6">
        <img 
          className="w-20" 
          src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417" 
          alt="Uber Logo" 
        />
      </div>

      <div className="absolute bottom-0 w-full mb-15 px-10 pb-10">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-6">
          <h2 className="text-3xl font-bold text-white">Get Started with Uber</h2>
          <p className="text-gray-200 mt-2">Your ride, just a tap away 🚖</p>

          <Link 
            to="/login" 
            className="mt-6 flex items-center justify-center w-full bg-yellow-400 hover:bg-yellow-500 transition-colors text-black font-semibold py-3 rounded-xl shadow-lg"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Start
