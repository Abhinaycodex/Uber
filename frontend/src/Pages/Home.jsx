import { useEffect, useRef, useState, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import LiveTracking from "../components/LiveTracking";

import { useSocket } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";



const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  // panels
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { user } = useContext(UserDataContext);
  
  
  // Socket events
  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("join", { userType: "user", userId: user._id });

      const handleRideConfirmed = (rideData) => {
        setVehicleFound(false);
        setWaitingForDriver(true);
        setRide(rideData);
      };

      const handleRideStarted = (rideData) => {
        setWaitingForDriver(false);
        navigate("/riding", { state: { ride: rideData } });
      };

      socket.on("ride-confirmed", handleRideConfirmed);
      socket.on("ride-started", handleRideStarted);

      return () => {
        socket.off("ride-confirmed", handleRideConfirmed);
        socket.off("ride-started", handleRideStarted);
      };
    }
  }, [socket, user, navigate]);




  // Input change handlers
  const handlePickupChange = async (e) => {
    setPickup('')
    
    setPickup(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPickupSuggestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDestinationSuggestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Trip handling
  async function findTrip() {
    setVehiclePanel(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFare(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function createRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        { pickup, destination, vehicleType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data) {
        setVehicleFound(true);
        setConfirmRidePanel(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Panels animation
  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      transform: vehiclePanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [vehiclePanel]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      transform: confirmRidePanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      transform: vehicleFound ? "translateY(0)" : "translateY(100%)",
    });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriver ? "translateY(0)" : "translateY(100%)",
    });
  }, [waitingForDriver]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Connecting to server...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Left: Map */}
      <div className="w-1/2 h-full relative">
        <LiveTracking />
      </div>

      {/* Right: Location + Panels */}
      <div className="w-1/2 h-full bg-white shadow-xl p-6 relative overflow-y-auto">
        {/* Logo */}
        <img
          className="w-24 mb-6"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber Logo"
        />

        <h2 className="text-2xl font-semibold mb-6">Where to?</h2>

        <div className="space-y-4">
          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3">
            <i className="ri-map-pin-line text-gray-500 mr-3"></i>
            <input
              value={pickup}
              onChange={handlePickupChange}
              onClick={() => setActiveField("pickup")}
              className="bg-transparent outline-none text-lg w-full"
              type="text"
              placeholder="Add pickup location"
            />
          </div>

          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3">
            <i className="ri-navigation-line text-gray-500 mr-3"></i>
            <input
              value={destination}
              onChange={handleDestinationChange}
              onClick={() => setActiveField("destination")}
              className="bg-transparent outline-none text-lg w-full"
              type="text"
              placeholder="Enter destination"
            />
          </div>

          <button
            onClick={findTrip}
            className="bg-black text-white w-full py-3 rounded-xl text-lg font-medium hover:bg-gray-900 transition"
          >
            Find Trip
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-6">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>

        {/* Panels */}
        <div ref={vehiclePanelRef} className="translate-y-full">
          <VehiclePanel
            selectVehicle={setVehicleType}
            fare={fare}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanel={setVehiclePanel}
          />
        </div>

        <div ref={confirmRidePanelRef} className="translate-y-full">
          <ConfirmRide
            createRide={createRide}
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehicleFound={setVehicleFound}
          />
        </div>

        <div ref={vehicleFoundRef} className="translate-y-full">
          <LookingForDriver
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound}
          />
        </div>

        <div ref={waitingForDriverRef} className="translate-y-full">
          <WaitingForDriver
            ride={ride}
            setVehicleFound={setVehicleFound}
            setWaitingForDriver={setWaitingForDriver}
            waitingForDriver={waitingForDriver}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
