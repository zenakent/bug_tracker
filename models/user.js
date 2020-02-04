let mongoose = require('mongoose')
let passportLocalMongoose = require('passport-local-mongoose')

let UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  first_name: String,
  last_name: String,
  role: {
    type: String,
    enum: ['admin', 'project_manager', 'developer', 'submitter', 'none'],
    default: 'none'
  },
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)