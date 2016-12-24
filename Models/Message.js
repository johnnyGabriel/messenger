const mongoose = require('mongoose')

const messageSchema = require('../Schemas/MessageSchema')

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
