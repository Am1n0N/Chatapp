const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./db/connection");
const app = express();

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// - CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Start the server
const server = app.listen(8080, () => {
    console.log("Server running on port 8080");
});
// - Socket.io

let io;
io = require('socket.io')(server);

const User = require('./data/User');
const Match = require('./data/Match');
const Chat = require('./data/Chat');
const connectedUsers = {};

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', async (userId) => {
        const user = await User.findById(userId);
        connectedUsers[userId] = socket.id;
        console.log(`User ${user.name} connected to socket ${socket.id}`);
    });

    socket.on('findMatch', async (userId) => {
        const user = await User.findById(userId);

        // Find a user that matches the current user's preferences
        const match = await Match.findOne({
            user1: { $ne: user._id },
            user2: { $ne: user._id },
            'users.gender': user.preferences.gender,
            'users.age': { $gte: user.preferences.ageRange.min, $lte: user.preferences.ageRange.max },
            'users.interests': { $in: user.preferences.interests },
        }).populate('users');

        if (match) {
            // Send a message to both users that they have been matched
            const user1SocketId = connectedUsers[match.user1.toString()];
            const user2SocketId = connectedUsers[match.user2.toString()];
            io.to(user1SocketId).emit('matched', match.users[0]);
            io.to(user2SocketId).emit('matched', match.users[1]);

            // Create a new chat for the matched users
            const chat = new Chat({
                users: match.users,
            });
            await chat.save();

            // Add the chat to the match
            match.chat = chat;
            await match.save();
        } else {
            // Send a message to the user that they could not find a match
            const socketId = connectedUsers[user._id.toString()];
            io.to(socketId).emit('noMatch');
        }
    });

    socket.on('sendMessage', async ({ chatId, senderId, text }) => {
        const chat = await Chat.findById(chatId);
        const sender = await User.findById(senderId);

        // Add the new message to the chat
        chat.messages.push({
            sender,
            text,
        });
        await chat.save();

        // Send the message to the other user in the chat
        const receiver = chat.users.find(user => user._id.toString() !== senderId);
        const receiverSocketId = connectedUsers[receiver._id.toString()];
        io.to(receiverSocketId).emit('newMessage', { chatId, sender, text });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


module.exports = app;