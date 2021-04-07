// Node Server which will handle Socket.io connections.
const io =require("socket.io")(8000); //8000 is port which we have taken.

const users={};


io.on('connection',socket =>{
    
    //If a new user joins, then let others ,who are already joined know this new user.
    socket.on('new-user-joined', names=>{
        users[socket.id]=names;
        socket.broadcast.emit('user-joined', names);
    });

    //If someone send the message,broadcast it to all other people.
    socket.on('send', message =>{
        socket.broadcast.emit('receive',{message:message, name: users[socket.id]});
    });

    //If someone leaves the chat then other to know
    socket.on('disconnect', message =>{
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });
});

