var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var nicknames = [];

app.use(express.static("Public"));

server.listen(3001, function () {
    console.log('listening on *:3001');
});

app.get('/', function (req, res) {

    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log(socket.id)
    socket.on('new user', function (username) {
        var exist = false;
        if (nicknames.length != 0) {
            for (let i = 0; i < nicknames.length; i++) {
                if (nicknames[i].username == username) {
                    exist = true;
                    break;
                }
            }

        } else {
            exist = false;
        }
        if (!exist) {
            nicknames.push({ id: socket.id, username: username })
        }

        socket.emit("exist", exist)


        // if (nicknames.indexOf(data) != -1) {
        //     callback(false);
        // } else {
        //     callback(true);
        //     socket.nickname = data;
        //     nicknames.push(socket.nickname);
        //     updateNicknames();
        // }
    });
    function updateNicknames() {
        io.emit('usernames', nicknames);
    }
    socket.on('send message', function (data) {
        io.emit('new message', { msg: data, nick: socket.nickname });
    });

    socket.on('disconnect', function () {
      
        for (let i = 0; i < nicknames.length; i++) {
            if (nicknames[i].id == socket.id) {
                nicknames.splice(i, 1);
                break;
            }
        }
        // if (!socket.nickname) return;
        // nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        // updateNicknames();
    });


});
