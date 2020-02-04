const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/bug_tracker", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  // useCreateIndex: true,
})

mongoose.Promise = Promise

module.exports.User = require("./user")
module.exports.Project = require("./project")
module.exports.Ticket = require("./ticket")
module.exports.Comment = require("./comment")