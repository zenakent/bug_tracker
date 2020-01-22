const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/bug_tracker", {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

mongoose.Promise = Promise

module.exports.User = require("./user")