var mongoose=require('mongoose');

var MessageSchema = new mongoose.Schema(
    {
        name:'string',
        message:'string'
    });
var Message = mongoose.model('Message',MessageSchema);
module.exports = Message;