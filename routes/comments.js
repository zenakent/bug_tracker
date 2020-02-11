const express = require('express');
const router = express.Router();
const db = require('../models')

const {
  isLoggedIn
} = require("../middleware/index.js");

router.get('/', (req, res) => {
  res.send("HELLO")
})

router.post('/create', isLoggedIn, async function (req, res) {
  try {
    let comment = await db.Comment.create(req.body);
    comment.ticket = req.body.ticket_id
    comment.commenter = req.user.username;
    comment.createdAt = Date.now()
    comment.save()
    let ticket = await db.Ticket.findById(req.body.ticket_id)
    ticket.comments.push(comment._id)
    ticket.save()
    res.redirect('back')
  } catch (error) {
    console.log(error);
    res.redirect('back')
  }
})

//delete comment
router.delete('/delete/:id', isLoggedIn, async (req, res) => {
  try {
    let foundComment = await db.Comment.findById(req.params.id)
    foundComment.remove()
    res.redirect('back')
  } catch (error) {
    console.log(error);
    res.redirect('back')
  }
})

module.exports = router;