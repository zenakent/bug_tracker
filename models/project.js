let mongoose = require('mongoose')


let ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true
  },
  description: String,
  personnel: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  },
})



module.exports = mongoose.model('Project', ProjectSchema)