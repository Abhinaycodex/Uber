import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';

// Create Socket Context
export const SocketContext = createContext();

// Custom hook for using the context
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io(import.meta.env.VITE_BASE_URL, {
            withCredentials: true,
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socketInstance.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        socketInstance.on('error', (error) => {
            console.error('Socket error:', error);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const value = {
        socket,
        isConnected,
        emit: (...args) => {
            if (socket) socket.emit(...args);
        },
        on: (event, callback) => {
            if (socket) socket.on(event, callback);
        },
        off: (event, callback) => {
            if (socket) socket.off(event, callback);
        }
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

SocketProvider.propTypes = {
    children: PropTypes.node.isRequired
};

// ✅ Fix: Export SocketProvider as Default
export default SocketProvider;
