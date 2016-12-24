const config = require('./config')
const mongoose = require('mongoose')
const MongoOplog = require('mongo-oplog')
const WebSocketServer = require('ws').Server
const Message = require('./Models/Message')

mongoose.Promise = require('bluebird')
mongoose.connect( config.mongoDbSrv + '/test' )

const oplog = MongoOplog(
        config.mongoDbSrv + '/local', { ns: 'test.messages' }
    )

const wss = new WebSocketServer({ port: 8080 })

wss.broadcast = (data) =>
    wss.clients.forEach(client => client.send(data))

oplog.tail()
    .then(() => console.log("tailing..."))
    .catch(err => console.log("error tailing" + err))

oplog.on('insert', filter => wss.broadcast(JSON.stringify(filter.o)))

wss.on('connection', socket => {

        console.log("socket opened");
    
        printClientsLength()
    
        Message.getAll()
            .then(JSON.stringify)
            .then(docs => {
    
                console.log("docs obtidos da collection messages");
                socket.send(docs)
    
            })
            .catch(err => console.log("erro ao ex stringify de docs" + err))
            .catch(err => console.log('erro ao obter docs da collections messages' + err))
    
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

    Message.insert({
        user: 'johnny',
        text: message
    })
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

console.log("running web socket app...");