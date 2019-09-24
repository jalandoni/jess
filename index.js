var express = require('express');
   index = express();
server =require('http').createServer(index);
 io = require('socket.io').listen(server);
nicknames = [];

index.use(express.static("Public"));

server.listen(3001,function(){
console.log('listening on *:3001');
});

index.get('/',function(req,res){

res.sendfile(__dirname + '/index.html');
});

io.on('connection',function(socket){
socket.on('new user',function(data,callback){
    if(nicknames.indexOf(data)!= -1){
        callback(false);
    }else{
    callback(true);
    socket.nickname = data;
    nicknames.push(socket.nickname);
    updateNicknames();
}
});


    function updateNicknames()
{
    io.emit('usernames',nicknames);
}   
    socket.on('send message',function(data){
          io.emit('new message',{msg:data,nick:socket.nickname});
     });

     

    socket.on('disconnect',function(data)
    {
    if(!socket.nickname)return;
    nicknames.splice(nicknames.indexOf(socket.nickname),1);
    updateNicknames();
    });
});
