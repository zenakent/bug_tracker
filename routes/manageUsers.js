//manage project users/personnel
let express = require('express');
let router = express.Router();
let db = require('../models')

let {
  isLoggedIn
} = require("../middleware/index.js");

router.get('/', isLoggedIn, async function (req, res) {
  try {
    let foundProjects = await db.User.findById(req.user._id).populate('projects').exec();
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
    let foundProject = await db.Project.findOne({
      title: req.params.project_title
    }).populate('personnel', {
      username: true
    })

    let foundUsers = await db.User.find({}, {
      username: true
    })

    let personnel = [],
      users = []

    for (x of foundProject.personnel) {
      personnel.push(x.username)
    }
    for (x of foundUsers) {
      users.push(x.username)
    }

    function diffArray(arr1, arr2) {
      return arr1
        .concat(arr2)
        .filter(item => !arr1.includes(item) || !arr2.includes(item));
    }

    let notPersonnel = diffArray(personnel, users)

    let arr = []
    for (let x of foundUsers) {
      for (let y of notPersonnel) {
        if (y === x.username) {
          arr.push(x)
        }
      }
    }
    res.render('manageUsers/edit', {
      foundProject,
      foundUsers,
      notPersonnel: arr
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