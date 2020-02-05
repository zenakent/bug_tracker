const express = require('express');
const router = express.Router();
const db = require('../models')

const {
  isLoggedIn
} = require("../middleware/index.js");

//index page
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const tickets = await db.User.findById(req.user._id).populate('tickets').exec();
    res.render('tickets/index', {
      tickets
    })
  } catch (error) {

  }
})

//get ticket create page
router.get('/:project_name/create', isLoggedIn, async function (req, res) {
  try {

    const project = await db.Project.findOne({
      title: req.params.project_name
    }).populate('personnel', {
      role: true,
      username: true,
      _id: true
    })
    const user = await db.User.findById(req.user._id, {
      username: true,
      _id: true
    })
    res.render('tickets/create', {
      project,
      user
    })
  } catch (error) {
    console.log(error)
    res.redirect('back')
  }
})

//create post ticket
router.post('/:project_name/create', isLoggedIn, async function (req, res) {
  try {
    let ticket = await db.Ticket.create(req.body);
    //push ticket id to found project   
    let foundProject = await db.Project.findOne({
      title: req.body.project
    })
    foundProject.tickets.push(ticket._id)
    foundProject.save();
    //push ticket to submitter
    let foundSubmitter = await db.User.findOne({
      username: req.body.submitter
    }) // console.log(foundSubmitter)
    foundSubmitter.tickets.push(ticket._id)
    foundSubmitter.save()
    res.redirect(`/projects/details/${req.body.project}`)
  } catch (error) {
    console.log(error)
    res.redirect('back')
  }
})

//ticket detail page
router.get('/details/:ticket_title', isLoggedIn, async function (req, res) {
  try {
    //look for ticket id instead. same title bug //mak
    const ticket = await db.Ticket.findOne({
      title: req.params.ticket_title
    }).populate('comments')
    res.render('tickets/details', {
      ticket
    })
  } catch (error) {
    console.log(error)
    res.redirect('back')
  }
})

//get ticket edit page
router.get('/details/edit/:ticket_id', isLoggedIn, async function (req, res) {
  try {
    const ticket = await db.Ticket.findById(req.params.ticket_id)
    const project = await db.Project.findOne({
      title: ticket.project
    }).populate('personnel', {
      role: true,
      username: true,
      _id: true
    })
    res.render('tickets/update', {
      ticket,
      project
    })
  } catch (error) {
    console.log(error)
    res.redirect('back')
  }
})

//ticket history route(more like edit route)
router.put('/details/edit/:ticket_id', isLoggedIn, async function (req, res) {
  try {
    let ticket = await db.Ticket.findByIdAndUpdate(req.params.ticket_id)
    for (const prop in req.body) {
      let pushIntoHistory = {
        property: null,
        old_value: null,
        new_value: null
      }
      if (ticket[prop] !== req.body[prop]) {
        pushIntoHistory.property = prop
        pushIntoHistory.old_value = ticket[prop]
        ticket[prop] = req.body[prop]
        pushIntoHistory.new_value = req.body[prop]
        ticket.ticket_history.push(pushIntoHistory)
      }
    }
    await ticket.save()
    res.redirect(`/tickets/details/${ticket.title}`)
  } catch (error) {
    console.log(error)
    res.redirect('back')
  }
})

module.exports = router;