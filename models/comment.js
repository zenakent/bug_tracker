let mongoose = require('mongoose')
let Ticket = require('./ticket')


let CommentSchema = new mongoose.Schema({
  commenter: {
    type: mongoose.Schema.Types.String,
    ref: 'User'
  },
  message: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }
})

// remove comment ID from Tickets comment array
CommentSchema.pre('remove', async function (next) {
  try {
    //find the ticket   
    console.log(this)
    let ticket = await Ticket.findById(this.ticket)
    // console.log(ticket)
    //remove id from project comments array.    
    ticket.comments.remove(this.id)
    //save that ticket    
    await ticket.save()
    //return next
    return next();
  } catch (error) {
    return next(error);
  }
})



module.exports = mongoose.model('Comment', CommentSchema)