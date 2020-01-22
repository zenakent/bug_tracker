let mongoose = require('mongoose')
let passportLocalMongoose = require('passport-local-mongoose')

let UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  first_name: String,
  last_name: String,
  is_Admin: {
    type: Boolean,
    default: false
  },
  is_Project_Manager: {
    type: Boolean,
    default: false
  },
  is_Developer: {
    type: Boolean,
    default: false
  },
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)