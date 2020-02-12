const express = require('express');
const router = express.Router();
const db = require('../models')

const {
  isLoggedIn
} = require("../middleware/index.js");

router.get('/', isLoggedIn, async function (req, res) {
  try {
    let foundUsers = await db.User.find()
    res.render('manageUsers/index', {
      foundUsers
    })
  } catch (error) {
    console.log(error)
    req.flash('error', `Something went wrong`)
    res.redirect('back')
  }
})

router.delete('/delete/:id', async function (req, res) {
  try {
    let foundUser = await db.User.findById(req.params.id)
    req.flash('success', `You've deleted ${foundUser.first_name} ${foundUser.last_name}`)
    foundUser.remove()
    res.redirect('back')
  } catch (error) {
    console.log(error)
    req.flash('error', `Something went wrong`)
    res.redirect('back')
  }
})

module.exports = router;