import express from 'express';
import http from 'http';
import { Server as socketServer } from 'socket.io';

const app = express();
const server = http.createServer(app)
const io = new socketServer(server)

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

server.listen(3000);
console.log("Server on port: ",3000)