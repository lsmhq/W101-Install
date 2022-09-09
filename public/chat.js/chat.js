const fs = require('fs');
var server = require('ws').Server;

var wss = new server({ port: 8000 });
wss.on('connection', function (ws) {
    // console.log(ws)
    ws.on('message',(msg)=>{
        let data = JSON.parse(msg)
        if(data.type === '1'){
            // 群聊
            console.log(data)
            wss.clients.forEach(wsss=>{

                wsss.send(msg.toString())
            })
        }
    })
    ws.on('close', function (close) {
        console.log(close);
    });
});

