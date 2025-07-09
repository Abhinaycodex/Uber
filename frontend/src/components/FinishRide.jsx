import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useSocket } from '../context/SocketContext'

const FinishRide = (props) => {
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { emit, on, off } = useSocket();

    const navigate = useNavigate();

    useEffect(() => {
        // Listen for ride completion confirmation
        const handleRideCompleted = (data) => {
            if (data.rideId === props.ride._id) {
                navigate('/captain-home');
            }
        };

        on('ride-completed', handleRideCompleted);

        return () => {
            off('ride-completed', handleRideCompleted);
        };
    }, [props.ride._id, navigate, on, off]);

    const handleSubmitFeedback = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            // Emit ride completion event via socket
            emit('complete-ride', {
                rideId: props.ride._id,
                rating,
                feedback
            });

            // Also send to REST API for redundancy
            await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/rides/feedback`, {
                rideId: props.ride._id,
                rating,
                feedback,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = async () => {
        try {
            setIsSubmitting(true);
            setError(null);
            
            // Emit ride completion without rating
            emit('complete-ride', {
                rideId: props.ride._id
            });

            await endRide();
        } catch (error) {
            console.error('Error completing ride:', error);
            setError('Failed to complete ride. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    async function endRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
            rideId: props.ride._id
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.status === 200) {
            navigate('/captain-home');
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Ride Complete</h2>
                
                <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                    props.setFinishRidePanel(false)
                }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>
                <div className='flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4'>
                    <div className='flex items-center gap-3'>
                        <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                        <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname}</h2>
                    </div>
                    <h5 className='text-lg font-semibold'>{props.ride?.distance ? (props.ride.distance / 1000).toFixed(1) : '0'} KM</h5>
                </div>

                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="ri-map-pin-user-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>Pickup Location</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>Drop Location</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 w-full">
                        <h3 className="text-lg font-semibold mb-2 text-center">Rate your ride</h3>
                        <div className="flex gap-2 mb-4 justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`text-3xl ${
                                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                    } hover:scale-110 transition-transform`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        <textarea
                            placeholder="Share your experience (optional)"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full p-2 border rounded-lg resize-none h-24 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                        />
                    </div>

                    <div className="w-full">
                        <div className="flex gap-4">
                            <button
                                onClick={handleSubmitFeedback}
                                disabled={isSubmitting}
                                className="bg-yellow-400 text-white px-4 py-2 rounded-lg flex-1 hover:bg-yellow-500 disabled:bg-yellow-200 transition-colors"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit & Finish Ride'}
                            </button>
                            <button
                                onClick={handleSkip}
                                disabled={isSubmitting}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex-1 hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
                            >
                                Skip Rating
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

FinishRide.propTypes = {
    ride: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        user: PropTypes.shape({
            fullname: PropTypes.shape({
                firstname: PropTypes.string.isRequired
            }).isRequired
        }).isRequired,
        distance: PropTypes.number,
        pickup: PropTypes.string.isRequired,
        destination: PropTypes.string.isRequired,
        fare: PropTypes.number.isRequired
    }).isRequired,
    setFinishRidePanel: PropTypes.func.isRequired
};

export default FinishRide;