const mongoose = require('mongoose')

const config = require('./config')
const oplog = require('./oplog')
const wss = require('./websocket')

mongoose.Promise = require('bluebird')
mongoose.connect( config.mongoDbSrv + '/test' )

oplog.on('insert', filter => wss.broadcast(JSON.stringify(filter.o)))

console.log("running web socket app in ws://localhost:8080...");