import { useRef, useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useSocket } from '../context/SocketContext'
import CaptainContext from '../context/CapatainContext'
import axios from 'axios'

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [ride, setRide] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const navigate = useNavigate()

    const { socket, isConnected } = useSocket()
    const { captain } = useContext(CaptainContext)

    // Handle socket connection and location updates
    useEffect(() => {
        if (!socket || !captain?._id) return;

        // Join captain's room
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        });

        // Location update function
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        socket.emit('update-location-captain', {
                            userId: captain._id,
                            location: {
                                ltd: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                        });
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        setErrorMessage('Unable to get your location. Please enable location services.');
                    }
                );
            }
        };

        // Set up location interval and initial update
        const locationInterval = setInterval(updateLocation, 10000);
        updateLocation();

        // Handle new ride requests
        const handleNewRide = (data) => {
            setRide(data);
            setRidePopupPanel(true);
        };

        socket.on('new-ride', handleNewRide);

        // Cleanup function
        return () => {
            clearInterval(locationInterval);
            socket.off('new-ride', handleNewRide);
        };
    }, [socket, captain]);

    const confirmRide = async () => {
        try {
            setErrorMessage(null);
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
                {
                    rideId: ride._id,
                    captainId: captain._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data) {
                setRidePopupPanel(false);
                setConfirmRidePopupPanel(true);
                // Navigate to riding page after confirmation
                navigate('/captain-riding', { state: { ride: response.data.ride } });
            }
        } catch (error) {
            console.error('Error confirming ride:', error);
            setErrorMessage('Failed to confirm ride. Please try again.');
        }
    };

    // Animation effects
    useGSAP(() => {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            });
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            });
        }
    }, [ridePopupPanel]);

    useGSAP(() => {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            });
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            });
        }
    }, [confirmRidePopupPanel]);

    // Render loading states
    if (!isConnected) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Connecting to server...</p>
                </div>
            </div>
        );
    }

    if (!captain) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Please log in to continue.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber logo" />
                <Link to='/captain/logout' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            {errorMessage && (
                <div className="fixed top-20 left-0 right-0 mx-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {errorMessage}
                </div>
            )}

            <div className='h-3/5'>
                <img 
                    className='h-full w-full object-cover' 
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" 
                    alt="Map visualization" 
                />
            </div>

            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>

            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    );
};

export default CaptainHome;