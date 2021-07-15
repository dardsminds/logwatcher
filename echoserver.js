var config = require("./config")();

var WebSocketServer = require("ws").Server;
var wsServer = new WebSocketServer({port:config.port});

wsServer.on("connection", function (ws) {

    console.log("EchoServer: Connection established!");
    ws.on("message", function (data) {
        wsServer.clients.forEach(function each(client) {
              client.send(data);
        });
    });

}); 
 