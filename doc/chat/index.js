import io from 'socket.io-client';
import chatUi from './chat_ui';
import './index.css';

const Chat = function(socket) {
    this.socket = socket;
}
Chat.prototype.sendMessage = (room, text) => {
    const message = {
        room,
        text,
    };
    this.socket.emit('message', message);
};
Chat.prototype.chageRoom = (room) => {
    this.socket.emit('join', {
        newRoom: room,
    });
};
Chat.prototype.processCommand = (command) => {
    const words = command.plit(' ');
    const commandText = words[0].substring(1, words[0].length).toLowerCase();
    let message = false;
    switch(commandText) {
        case 'join':
            words.shift();
            const room = words.join(' ');
            this.chageRoom(room);
            break;
        case 'nick':
            words.shift();
            const name = words.join(' ');
            this.socket.emit('nameAttempt', name);
            break;
        default:
            message = 'Unrecognized command';
            break;
    }
    return message;
}
const socket = io.connect();
const chatApp = new Chat(socket);
socket.on('nameResult', (result) => {
    const message = result.success ? `You are now known as ${result.name}.` : result.message;
    $('#message').append(chatUi.divSystemContentElement(message));
});
socket.on('joinResult', (result) => {
    $('#room').text(result.room);
    $('#message').append(chatUi.divSystemContentElement('Room changed'));
});
socket.on('message', (message) => {
    const newElement = $('<div></div>').text(message.text);
    $('#message').append(newElement);
});
socket.on('rooms', (rooms) => {
    $('#room-list').empty();
    for (let room in rooms) {
        room = room.substring(1, room.length);
        if (room !== '') {
            $('room-list').append(chatUi.divSystemContentElement(room));
        }
    }
});
$('#send-form').submit(() => {
    chatUi.processUserInput(chatApp);
    return false;
});
