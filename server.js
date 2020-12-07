const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Sætter den til at køre vores index side, når serveren er i gang
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'BuddyHood Bot';

// Kører når en bruger opretter forbindelse
io.on('connection', socket => {

    // Velkomst besked til den nye bruger
    socket.emit('message', formatMessage(botName, 'Velkommen til BuddyHood chatten.'));

    // Gør opmærksom på en ny bruger har tilkoblet sig chatten
    socket.broadcast.emit('message', formatMessage(botName, 'En ny bruger har tilkoblet sig chatten.'));

    // Kører når en bruger forlader chatten
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'En bruger har forladt chatten.'));
    });

    // Opfanger chatMessage (beskeden/værdien) fra main.js og sender retur
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('BRUGER', msg));
    });


});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

