const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const cors = require('cors');

const port = process.env.PORT || 4000;
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Handle server errors
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});


// Remove or adjust Express CORS if present
app.use(cors({
    origin: "*",
    credentials: true
}));

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

