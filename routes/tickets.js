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

    //push ticket to submitter
    let foundSubmitter = await db.User.findOne({
      username: req.body.submitter
    })

    let foundDeveloper = await db.User.findOne({
      username: req.body.developer
    })

    //make new notification
    let notification = await db.Notification.create({
      ticket_title: ticket.title,
      notification_type: 'Ticket',
      notified_date: Date.now(),
      project_title: ticket.project,
    })

    notification.message = `${notification.notification_type} "${notification.ticket_title}" has been made in ${notification.project_title}`
    notification.link = `/tickets/details/${notification.ticket_title}`
    notification.save()


    foundProject.tickets.push(ticket._id)
    foundProject.save();

    foundSubmitter.tickets.push(ticket._id)
    foundSubmitter.notifications.push(notification)
    foundSubmitter.save()

    foundDeveloper.tickets.push(ticket._id)
    foundDeveloper.notifications.push(notification)
    foundDeveloper.save()

    res.io.emit('newTicket', notification)
    req.flash('success', `You've created a new ticket`)
    res.redirect(`/projects/details/${req.body.project}`)
  } catch (error) {
    console.log(error)
    req.flash('error', `Something went wrong`)
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
router.post('/details/edit/:ticket_id', isLoggedIn, async function (req, res) {
  try {
    let ticket = await db.Ticket.findByIdAndUpdate(req.params.ticket_id)
    for (const prop in req.body) {
      let pushIntoHistory = {
        property: null,
        old_value: null,
        new_value: null,
        date_changed: Date.now()
      }
      if (ticket[prop] !== req.body[prop]) {
        pushIntoHistory.property = prop
        pushIntoHistory.old_value = ticket[prop]
        ticket[prop] = req.body[prop]
        pushIntoHistory.new_value = req.body[prop]
        ticket.ticket_history.push(pushIntoHistory)
      }
    }

    //make new notification
    let notification = await db.Notification.create({
      ticket_title: ticket.title,
      notification_type: 'Ticket',
      notified_date: Date.now(),
      project_title: ticket.project,
    })
    notification.link = `/tickets/details/${notification.ticket_title}`
    notification.message = `${notification.notification_type} "${notification.ticket_title}" has been updated`
    notification.save()
    //find people that created the ticket and developer and
    let developer = await db.User.findOne({
      username: ticket.developer
    })

    let submitter = await db.User.findOne({
      username: ticket.submitter
    })

    //push to their notification array
    developer.notifications.push(notification)
    submitter.notifications.push(notification)
    //save
    await developer.save()
    await submitter.save()

    res.io.emit('ticketUpdate', notification)
    await ticket.save()
    res.redirect(`/tickets/details/${ticket.title}`)
  } catch (error) {
    console.log(error)
    req.flash('error', `Something went wrong`)
    res.redirect('back')
  }
})

module.exports = router;