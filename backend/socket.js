const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const rideModel = require('./models/ride.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin:  "http://localhost:5173",   
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected:  ${socket.id}`);

        // Handle user/captain joining
        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;
                if (!userId || !userType) {
                    return socket.emit('error', { message: 'Invalid join data' });
                }

                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                    socket.join(`user_${userId}`);
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                    socket.join(`captain_${userId}`);
                } else {
                    return socket.emit('error', { message: 'Invalid user type' });
                }

                socket.emit('joined', { success: true });
            } catch (error) {
                console.error('Join error:', error);
                socket.emit('error', { message: 'Failed to join' });
            }
        });

        // Handle captain location updates
        socket.on('update-location-captain', async (data) => {
            try {
                const { userId, location } = data;

                if (!userId || !location || !location.ltd || !location.lng) {
                    return socket.emit('error', { message: 'Invalid location data' });
                }

                const captain = await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        ltd: location.ltd,
                        lng: location.lng
                    }
                }, { new: true });

                if (!captain) {
                    return socket.emit('error', { message: 'Captain not found' });
                }

                // If captain is in a ride, notify the user
                const activeRide = await rideModel.findOne({
                    captain: userId,
                    status: 'ongoing'
                });

                if (activeRide) {
                    io.to(`user_${activeRide.user}`).emit('captain-location-update', {
                        location: captain.location,
                        rideId: activeRide._id
                    });
                }
            } catch (error) {
                console.error('Location update error:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        // Handle ride status updates
        socket.on('update-ride-status', async (data) => {
            try {
                const { rideId, status, userId, userType } = data;

                if (!rideId || !status || !userId || !userType) {
                    return socket.emit('error', { message: 'Invalid ride update data' });
                }

                const ride = await rideModel.findById(rideId);
                if (!ride) {
                    return socket.emit('error', { message: 'Ride not found' });
                }

                // Verify the user has permission to update the ride
                if ((userType === 'captain' && ride.captain.toString() !== userId) ||
                    (userType === 'user' && ride.user.toString() !== userId)) {
                    return socket.emit('error', { message: 'Unauthorized to update ride' });
                }

                ride.status = status;
                await ride.save();

                // Notify both user and captain
                io.to(`user_${ride.user}`).to(`captain_${ride.captain}`).emit('ride-status-updated', {
                    rideId: ride._id,
                    status: ride.status
                });
            } catch (error) {
                console.error('Ride update error:', error);
                socket.emit('error', { message: 'Failed to update ride status' });
            }
        });

        // Handle ride completion
        socket.on('complete-ride', async (data) => {
            try {
                const { rideId, rating, feedback } = data;
                
                if (!rideId) {
                    return socket.emit('error', { message: 'Invalid ride data' });
                }

                const ride = await rideModel.findByIdAndUpdate(rideId, {
                    status: 'completed',
                    rating,
                    feedback,
                    feedbackSubmitted: true
                }, { new: true });

                if (!ride) {
                    return socket.emit('error', { message: 'Ride not found' });
                }

                // Notify both parties
                io.to(`user_${ride.user}`).to(`captain_${ride.captain}`).emit('ride-completed', {
                    rideId: ride._id,
                    rating,
                    feedback
                });
            } catch (error) {
                console.error('Ride completion error:', error);
                socket.emit('error', { message: 'Failed to complete ride' });
            }
        });

        socket.on('disconnect', async () => {
            try {
                console.log(`Client disconnected: ${socket.id}`);
                // Update user/captain socket ID to null when they disconnect
                await Promise.all([
                    userModel.findOneAndUpdate({ socketId: socket.id }, { socketId: null }),
                    captainModel.findOneAndUpdate({ socketId: socket.id }, { socketId: null })
                ]);
            } catch (error) {
                console.error('Disconnect error:', error);
            }
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (!socketId || !messageObject || !messageObject.event) {
        console.error('Invalid message data:', { socketId, messageObject });
        return;
    }

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.error('Socket.io not initialized.');
    }
};

module.exports = { initializeSocket, sendMessageToSocketId };