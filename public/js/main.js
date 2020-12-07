const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

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
    div.innerHTML = `<p class="meta">Andrew <span>9:12</span></p>
                <p class="text">
                    ${message}
                </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}