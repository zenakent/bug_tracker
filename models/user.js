const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
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
    enum: ['admin', 'project_manager', 'developer', 'submitter'],
    default: 'submitter'
  },
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }]
})

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
})

module.exports = mongoose.model('User', UserSchema)