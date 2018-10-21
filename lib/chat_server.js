const socketio = require('socket.io');
let guestNumber = 1;
const nickNames = {};
const namesUsed = [];
const currentRoom = {};

const assignGuestName = (socket, guestNumber, nickNames, namesUsed) => {
    const name = `Guest${guestNumber}`;
    nickNames[socket.id] = name; // 关联用户昵称和客户端id
    socket.emit('nameResult', {
        success: true,
        name,
    });
    namesUsed.push(name);
    return guestNumber + 1;
};
const joinRoom = (socket, io, room) => {
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {room,});
    socket.broadcast.to(room).emit('message', {
        text: `${nickNames[socket.id]} has joined ${room}.`,
    });
    io.of('/').in(room).clients((error,clients) => {
        const len = clients.length;
        if (len > 1) {
            let userInRoomSummary = `Users currently in ${room}:`;
            for (let index in clients) {
                const userSocketId = clients[index].id;
                if (userSocketId !== socket.id) {
                    if (index > 0) {
                        userInRoomSummary = `${userInRoomSummary}, `;
                    }
                    userInRoomSummary = `${userInRoomSummary}${nickNames[userSocketId]}`;
                }
            }
            userInRoomSummary = `${userInRoomSummary}.`;
            socket.emit('message', {text: userInRoomSummary});
        }
    });
};
const handleMessageBroadcasting = (socket) => {
    socket.on('message', (data) => {
        socket.broadcast.to(data.room).emit('message', {
            text: `${nickNames[socket.id]}: ${data.text}`,
        })
    })
};
const handleNameChangeAttempts = (socket) => {
    socket.on('nameAttempt', (name) => {
        if (namesUsed.indexOf('name') === -1) {
            const previousName = nickNames[socket.id];
            const previousNameIndex = namesUsed.indexOf(previousName);
            namesUsed.push(name);
            nickNames[socket.id] = name;
            delete namesUsed[previousNameIndex];
            socket.emit('nameResult', {
                success: true,
                name,
            });
            socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                text: `${previousName} is now known as ${name}.`
            });
        } else {
            socket.emit('nameResult', {
                success: true,
                message: 'That name is already in use',
            })
        }
    })
};
const handleRoomJoining = (socket, io) => {
    socket.on('join', (room) => {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, io, room.newRoom);
    });
};
const handleClientDisconnection = (socket) => {
    socket.on('disconnect', () => {
        const nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    });
};
exports.liten = (server) => {
    const io = socketio.listen(server);
    io.sockets.on('connection', (socket) => {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, io, 'Lobby');
        handleMessageBroadcasting(socket);
        handleNameChangeAttempts(socket);
        handleRoomJoining(socket, io);
        socket.on('room', () => { // ??
            socket.emit('rooms', io.sockets.manager.rooms);
        });
        handleClientDisconnection(socket);
    });
}