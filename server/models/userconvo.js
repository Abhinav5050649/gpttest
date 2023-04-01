const mongoose = require(`mongoose`)
const Schema = mongoose.Schema

const userconvoSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    conversation: {
        type: [[String, String]],
        required: true
    }
})


const userConvo = mongoose.model('userconvo', userconvoSchema)
module.exports = userConvo