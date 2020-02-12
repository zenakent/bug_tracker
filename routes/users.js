const express = require('express');
const router = express.Router();
const db = require('../models')

const {
  isLoggedIn,
  isAdmin,
} = require("../middleware/index.js");

/* GET users listing. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render("dashboard")
});

router.get('/roleAssignment', isLoggedIn, isAdmin, function (req, res, next) {
  db.User.find({})
    .then(foundUsers => {
      res.render('roleAssignment', {
        foundUsers
      })
    })
    .catch(err => console.log(err))
})

router.put('/roleAssignment', isLoggedIn, isAdmin, function (req, res) {
  db.User.find({
      username: req.body.selectUser
    })
    .then(user => {
      user.forEach(eachUser => {
        eachUser.role = req.body.selectRole
        eachUser.save()
      })
      req.flash('success', `You've changed role assignments`)
      res.redirect('/users/roleAssignment')
    })
    .catch(err => {
      req.flash('error', `Something went wrong`)
      console.log(err)
    })
})

router.get('/notifications', isLoggedIn, async function (req, res) {
  let foundUser = await db.User.findById(req.user.id).populate('notifications')
  res.render('notifications', {
    foundUser
  })
})

module.exports = router;