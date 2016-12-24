const mongoose = require('mongoose')

var fields = {
    user: {
        type: String,
        default: 'anonimo'
    },
    text: String,
    date: {
        type: Date,
        default: Date.now
    }
}

var messageSchema = mongoose.Schema(fields)

messageSchema.statics.insert = function(message) {
    return this.create(message)
}

messageSchema.statics.getAll = function() {
    return this.find()
}

module.exports = messageSchema