const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Sætter den til at køre vores index side, når serveren er i gang
app.use(express.static(path.join(__dirname, 'public')));

// Kører når en bruger opretter forbindelse
io.on('connection', socket => {

    // Velkomst besked til den nye bruger
    socket.emit('message', 'Velkommen til meeton.');

    // Gør opmærksom på en ny bruger har tilkoblet sig chatten
    socket.broadcast.emit('message', 'En bruger har tilkoblet sig chatten.');

    // Kører når en bruger forlader chatten
    socket.on('disconnect', () => {
        io.emit('message', 'En bruger har forladt chatten.');
    });


});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

