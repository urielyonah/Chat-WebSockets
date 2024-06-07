import express from 'express';
import http from 'http';
import { Server as socketServer } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app)

const allowedOrigins = ['https://chat-web-sockets-ten.vercel.app'];

const io = new socketServer(server, {
    cors: {
        origin: 'https://chat-web-sockets-ten.vercel.app',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});


app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

io.on('connection', socket => {
    console.log('User connected: ',socket.id)
    socket.on('message', (body) => {
        socket.broadcast.emit('message', {
            body,
            from: socket.id.slice(0, 6)
        })
    })
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});