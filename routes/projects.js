const express = require('express');
const router = express.Router();
const db = require('../models')

const {
  isLoggedIn,
  isDeveloper
} = require("../middleware/index.js");

router.get('/', isLoggedIn, async function (req, res) {
  try {

    const foundProjects = await db.User.findById(req.user._id).populate('projects').exec();
    res.render('projects/index', {
      foundProjects
    })
  } catch (error) {
    console.log(error)
    res.redirect('back')
  }
})

//////////////////////////////////////////////
//project crud
//////////////////////////////////////////////

//project details page
router.get('/details/:project_title', isLoggedIn, async (req, res) => {
  const foundProject = await db.Project.findOne({
    title: req.params.project_title
  }).populate('personnel').populate('tickets').exec()

  res.render('projects/details', {
    foundProject
  })
})

//get create page
router.get('/create', isLoggedIn, async function (req, res) {
  try {
    const foundUsers = await db.User.find({})
    res.render('projects/create', {
      foundUsers
    })
  } catch (error) {
    console.log(error)
    res.redirect('back')
  }
})

//post create
router.post('/create', isLoggedIn, async function (req, res) {
  try {
    let project = await db.Project.create(req.body)
    //add project to each personnel that is assigned
    project.personnel.forEach(async person => {
      let foundPerson = await db.User.findById(person)
      foundPerson.projects.push(project._id)
      foundPerson.save()
    })
    req.user.projects.push(project._id)
    req.user.save()
    res.redirect("/projects")
  } catch (error) {
    console.log(error)
    res.redirect('back')
  }
})

//delete project
router.delete('/delete/:id', isLoggedIn, async function (req, res) {
  try {
    let project = await db.Project.findById(req.params.id)
    project.remove()
    res.redirect('back')
  } catch (error) {
    console.log(error)
    res.redirect('back')
  }
})



module.exports = router;