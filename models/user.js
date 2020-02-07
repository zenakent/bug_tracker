let mongoose = require('mongoose')
let passportLocalMongoose = require('passport-local-mongoose')

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true
  },
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

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
})

module.exports = mongoose.model('User', UserSchema)