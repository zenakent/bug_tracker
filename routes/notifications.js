const express = require('express');
const router = express.Router();
const db = require('../models')

const {
  isLoggedIn,
  isAdmin,
} = require("../middleware/index.js");

router.get('/all', isLoggedIn, async function (req, res) {
  let foundUser = await db.User.findById(req.user.id).populate('notifications')
  res.render('notifications', {
    foundUser
  })
})

//go to project/ticket notifcation detail
router.get('/:notification_id', isLoggedIn, async function (req, res) {
  try {
    let foundNotification = await db.Notification.findById(req.params.notification_id)
    foundNotification.isRead = true
    foundNotification.save()
    if (foundNotification.notification_type === 'Ticket') {
      res.redirect(`${foundNotification.link}`)
    }
    if (foundNotification.notification_type === 'Project') {
      res.redirect(`${foundNotification.link}`)
    }
  } catch (error) {
    console.log(error)
    req.flash('error', 'Something went wrong')
    res.redirect('back')
  }

})

module.exports = router;