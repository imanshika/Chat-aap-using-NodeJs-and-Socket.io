const io = require('socket.io')(8000, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
});

let users = {};
let id = 0;

io.on('connection', socket => {

    socket.on('new-user-joined', userName =>{
        if(!userName){
            userName = "Anonymous"
        }
        id++;
        socket.emit('joined', {users: users, myId: id});
        users[socket.id] = {id: id, userName: userName};
        socket.broadcast.emit('user-joined', {id: id, userName: userName});
    });
    
    socket.on('send', message =>{
        userName = users[socket.id].userName;
        socket.broadcast.emit('receive', {message: message, userName: userName});
    });

    socket.on("disconnect", () => {
        userName = users[socket.id].userName;
        id = users[socket.id].id;
        socket.broadcast.emit('left', {id: id, userName: userName});
        delete users[socket.id];
    });
})
