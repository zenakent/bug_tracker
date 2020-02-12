const express = require('express');
const router = express.Router();
const db = require('../models')

const {
  isLoggedIn,
} = require("../middleware/index.js");

router.get('/', isLoggedIn, async function (req, res) {
  try {
    let foundUser = await db.User.findById(req.user._id)
    res.render('profile/index', {
      foundUser
    })
  } catch (error) {
    console.log(error)
    req.flash('error', `Something went wrong`)
    res.redirect('back')
  }
})

router.put('/update/:id', async function (req, res) {
  try {
    let foundUser = await db.User.findByIdAndUpdate(req.user._id)
    foundUser.first_name = req.body.first_name
    foundUser.last_name = req.body.last_name
    foundUser.email = req.body.email
    foundUser.save()
    req.flash('success', `You've updated your profile`)
    res.redirect('/profile')
  } catch (error) {
    console.log(error)
    req.flash('error', `Something went wrong`)
    res.redirect('back')
  }
})

module.exports = router;