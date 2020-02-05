//manage project users/personnel
const express = require('express');
const router = express.Router();
const db = require('../models')

const {
  isLoggedIn
} = require("../middleware/index.js");

router.get('/', isLoggedIn, async function (req, res) {
  try {
    const foundProjects = await db.User.findById(req.user._id).populate('projects').exec();
    res.render('manageUsers/index', {
      foundProjects
    })
  } catch (error) {
    console.log(error)
    res.redirect('back')
  }
})

router.get('/:project_title/manageProjectUsers', isLoggedIn, async function (req, res) {
  try {
    const foundProject = await db.Project.findOne({
      title: req.params.project_title
    }).populate('personnel', {
      username: true
    })

    const foundUsers = await db.User.find({}, {
      username: true
    })

    const personnel = JSON.parse(JSON.stringify(foundProject.personnel))
    const users = JSON.parse(JSON.stringify(foundUsers))

    function comparer(otherArray) {
      return function (current) {
        return otherArray.filter(function (other) {
          return other.username == current.username && other._id == current._id
        }).length == 0;
      }
    }

    let onlyInA = personnel.filter(comparer(users));
    let onlyInB = users.filter(comparer(personnel));

    result = onlyInA.concat(onlyInB);


    res.render('manageUsers/edit', {
      foundProject,
      foundUsers,
      notPersonnel: result
    })
  } catch (error) {
    console.log(error)
    res.redirect('back')
  }
})

router.put('/:project_title/manageProjectUsers', isLoggedIn, async function (req, res) {
  try {

    let foundProject = await db.Project.findOne({
      title: req.params.project_title
    })
    foundProject.personnel = req.body.personnel
    foundProject.save()
    res.redirect(`/projects/details/${req.params.project_title}`)
  } catch (error) {
    console.log(error)
    res.redirect('back')
  }
})

module.exports = router;