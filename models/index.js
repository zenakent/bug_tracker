const mongoose = require('mongoose')

// mongoose.connect("mongodb://localhost:27017/bug_tracker", {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   // useCreateIndex: true,
// })

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@cluster0-s8v4h.mongodb.net/test?retryWrites=true&w=majority`, {
  dbName: "bug_tracker",
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
})

mongoose.Promise = Promise

module.exports.User = require("./user")
module.exports.Project = require("./project")
module.exports.Ticket = require("./ticket")
module.exports.Comment = require("./comment")
module.exports.Notification = require("./notification")