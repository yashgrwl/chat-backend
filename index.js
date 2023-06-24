const express=require('express');
const http=require('http');
const app=express();
const socketIo=require('socket.io')
const cors=require('cors')

const port=process.env.PORT;

const server=http.createServer(app);

const io=socketIo(server);

app.use(cors());

app.get('/',(req,res)=>{
    res.send('hello')
})
let users=[]
io.on('connection',(socket)=>{
    
    console.log('connection started')
   
    socket.on('joined',({user})=>{
        users[socket.id]=user;
      //  console.log(`welcome ${users[socket.id]}`)


        socket.emit('welcome',{user:'Admin',msg:`Welcome ${users[socket.id]}`,id: socket.id})

        socket.broadcast.emit('userjoined',{user:'Admin',msg:`${user} has joined`,id:socket.id})
    })

    socket.on('disconnectUser',()=>{
        socket.broadcast.emit('leave',{user:'Admin',msg:`${users[socket.id]} has left`,id:socket.id})
       // console.log('user has left')
    })
    socket.on('message',({text,id})=>{
      //  console.log(`${users[id]}: ${text}`)

      io.emit('sendMessage',{user:users[id],msg:text,id})

    })

    
})

server.listen(port,()=>{
    console.log('server running')
})
