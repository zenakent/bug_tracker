let mongoose = require('mongoose')
let Project = require('./project')
let User = require('./user')

let TicketSchema = new mongoose.Schema({
  title: String,
  description: String,
  submitter: {
    type: mongoose.Schema.Types.String,
    ref: 'User'
  },
  developer: {
    type: mongoose.Schema.Types.String,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['New', 'Open', 'In Progress', 'Resolved', 'More Info Required'],
    default: 'New',
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  project: {
    type: mongoose.Schema.Types.String,
    ref: 'Project'
  },
  ticket_type: {
    type: String,
    enum: ['Bugs/Errors', 'Aesthetic', 'Feature Request', 'Technical Issue'],
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  //add ticket history? figure out how first
  ticket_history: [{
    property: String, //object property/value that will be changed
    old_value: String, // old value of object property
    new_value: String, // new value of object property
    date_changed: {
      type: Date,
      default: Date.now()
    }
  }],
})

//remove ticket id from projects & users if ticket is deleted
TicketSchema.pre('remove', async function (next) {
  try {
    //find the project
    let project = await Project.findById(this.project);
    let user = await User.findById(this.user)
    //remove id from project ticket array.
    project.tickets.remove(this.id);
    user.tickets.remove(this.id);
    //save that project
    project.save();
    user.save()
    //return next
    return next();
  } catch (error) {
    return next(error);
  }
})

module.exports = mongoose.model('Ticket', TicketSchema)