const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  isRead: {
    type: Boolean,
    default: false
  },
  title: String,
  notified_date: {
    type: Date,
    default: Date.now()
  },
  notification_type: {
    type: String,
    enum: ['Ticket', 'Project']
  },
  project_title: String,
  ticket_title: String,
  message: String,
  link: String,
})



module.exports = mongoose.model('Notification', NotificationSchema)