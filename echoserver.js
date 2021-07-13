var WebSocketServer = require("ws").Server;
var wsServer = new WebSocketServer({port:8087});

wsServer.on("connection", function (ws) {

    console.log("EchoServer: Connection established!");
    ws.on("message", function (data) {
        wsServer.clients.forEach(function each(client) {
              client.send(data);
        });
    });

}); 
