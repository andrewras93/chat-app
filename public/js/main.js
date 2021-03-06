const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
// Hent brugernavn og chatrum fra URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

// Join chatrum
socket.emit('joinRoom', {username, room});

// Henter chatrum og brugere
socket.on('roomUsers', ({room, users}) =>{
   outputRoomName(room);
   outputUsers(users);
});

// Opfanger beskeden fra serveren og kører nedenstående funktioner
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Ruller ned til bunden af chatten, når en besked sendes
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Send besked
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Tager værdien som bliver indtastet i chatfeltet
    const msg = e.target.elements.msg.value;

    // Sender værdien (beskeden) til serveren
    socket.emit('chatMessage', msg);

    // Ryd og forbliv i chatfeltet efter en besked er sendt
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Udskriver besked værdierne som HTML tekst i dokumentet
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                <p class="text">
                    ${message.text}
                </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Udskriver navnet på chatrummet som HTML tekst i dokumentet
function outputRoomName(room){
    roomName.innerText = room;
}

// Udskriver bruger liste for hvert chatrum
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
