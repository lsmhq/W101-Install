const fs = require('fs');
var server = require('ws').Server;

var wss = new server({ port: 8000 });
wss.on('connection', function (ws) {
    // console.log(ws)
    
    ws.on('message',(data)=>{
        data = JSON.parse(data.toString('utf-8')) 
        wss.clients.forEach(wsss=>{
            if(ws == wsss){
                wsss.send('success')
            }else{
                wsss.send(JSON.stringify(data))
            }
        }) 
    })
    ws.on('close', function (close) {
        console.log('closed');
    });
});

