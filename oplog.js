const config = require('./config')
const MongoOplog = require('mongo-oplog')
const wss = require('./websocket')

const oplog = MongoOplog(
        config.mongoDbSrv + '/local', { ns: 'test.messages' }
    )

oplog.tail()
    .then(() => console.log("tailing..."))
    .catch(err => console.log("error tailing" + err))

module.exports = oplog