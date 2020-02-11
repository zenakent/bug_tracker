const express = require('express');
const router = express.Router();
const db = require('../models')

const {
  isLoggedIn,
  isAdmin,
  isProjectManager
} = require("../middleware/index.js");

//api for ticket for every ticket for the user
router.get('/tickets', isLoggedIn, async (req, res) => {
  let foundUser = await db.User.findById(req.user._id).populate('tickets', {
    ticket_history: false,
    comments: false,
  })
  res.json(foundUser)
})


module.exports = router;