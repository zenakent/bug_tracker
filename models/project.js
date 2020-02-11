const mongoose = require('mongoose')


const ProjectSchema = new mongoose.Schema({
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
  project_completed: {
    type: Boolean,
    default: false
  },
  completed_date: Date
})



module.exports = mongoose.model('Project', ProjectSchema)