const WebSocketServer = require('ws').Server
const Message = require('./Models/Message')

const wss = new WebSocketServer({ port: 8080 })

wss.broadcast = (data) =>
    wss.clients.forEach(client => client.send(data))

wss.on('connection', socket => {

        console.log("socket opened");
    
        printClientsLength()
    
        socket
            .on('message', socketMessageHandler)
            .on('close', socketCloseHandler)
            .on('error', socketErrorHandler)
    })

   .on('error', err => {
       console.log("websocket server error " + err);
   })

const socketMessageHandler = message => {

    console.log("socket received message");

    Message.insert( JSON.parse(message) )
        .then(doc =>
            console.log("doc inserido na collection messages" + doc))
        .catch(err => 
            console.log('erro ao inserir doc na collection messages' + err))
}

const socketCloseHandler = (code, reason) => {

    console.log("socket closed", code, reason);

    printClientsLength()

}

const socketErrorHandler = error =>
    console.log("socket error", error)

const printClientsLength = () => console.log('sockets', wss.clients.length)

module.exports = wss