//manage project users/personnel
const express = require('express');
const router = express.Router();
const db = require('../models');

const {
  isLoggedIn
} = require('../middleware/index.js');

router.get('/', isLoggedIn, async function (req, res) {
  try {
    const foundProjects = await db.User.findById(req.user._id).populate('projects').exec();
    res.render('manageProjectUsers/index', {
      foundProjects
    });
  } catch (error) {
    console.log(error);
    res.redirect('back');
  }
});

router.get('/:project_title/manageProjectUsers', isLoggedIn, async function (req, res) {
  try {
    const foundProject = await db.Project
      .findOne({
        title: req.params.project_title
      })
      .populate('personnel', {
        username: true,
        role: true
      });

    const foundUsers = await db.User.find({}, {
      username: true,
      role: true
    });

    //filter the non project personnel from the list of foundUsers and send it as a new list
    const personnel = JSON.parse(JSON.stringify(foundProject.personnel));
    const users = JSON.parse(JSON.stringify(foundUsers));

    function comparer(otherArray) {
      return function (current) {
        return (
          otherArray.filter(function (other) {
            return other.username == current.username && other._id == current._id;
          }).length == 0
        );
      };
    }
    let onlyInA = personnel.filter(comparer(users));
    let onlyInB = users.filter(comparer(personnel));
    result = onlyInA.concat(onlyInB);

    res.render('manageProjectUsers/edit', {
      foundProject,
      foundUsers,
      notPersonnel: result
    });
  } catch (error) {
    console.log(error);
    res.redirect('back');
  }
});

router.put('/:project_title/manageProjectUsers', isLoggedIn, async function (req, res) {
  try {

    let foundProject = await db.Project.findOne({
      title: req.params.project_title
    });

    //remove the project from user's project array
    if (typeof req.body.notPersonnel === 'string') {
      let foundPerson = await db.User.findById(req.body.notPersonnel)
      foundPerson.projects.remove(foundProject._id)
      await foundPerson.save()
    } else {
      req.body.notPersonnel.forEach(async person => {
        let foundPerson = await db.User.findById(person)
        foundPerson.projects.remove(foundProject._id)
        await foundPerson.save()
      })
    }

    //add the project to the user's project array if it doesn't exist in the array yet.
    if (typeof req.body.personnel === 'string') {
      let foundPerson = await db.User.findById(req.body.personnel)
      if (!foundPerson.projects.includes(foundProject._id)) {
        foundPerson.projects.push(foundProject._id);
        await foundPerson.save()
      }
    } else {
      req.body.personnel.forEach(async person => {
        let foundPerson = await db.User.findById(person)
        if (!foundPerson.projects.includes(foundProject._id)) {
          foundPerson.projects.push(foundProject._id);
          await foundPerson.save()
        }
      })
    }

    foundProject.personnel = req.body.personnel;
    foundProject.save();
    res.redirect(`/projects/details/${req.params.project_title}`);
  } catch (error) {
    console.log(error);
    res.redirect('back');
  }
});

module.exports = router;