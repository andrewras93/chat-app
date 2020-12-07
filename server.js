const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Sætter den til at køre vores index side, når serveren er i gang
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'BuddyHood Bot';

// Kører når en bruger opretter forbindelse
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Velkomst besked til den nye bruger
        socket.emit('message', formatMessage(botName, 'Velkommen til BuddyHood chatten.'));

        // Gør opmærksom på en ny bruger har tilkoblet sig chatten
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} har tilkoblet sig chatten.`));
    });

    // Opfanger chatMessage (beskeden/værdien) fra main.js og sender retur
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Kører når en bruger forlader chatten
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} har forladt chatten.`));
        }
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

