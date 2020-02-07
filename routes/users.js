let express = require('express');
let router = express.Router();
let db = require('../models')

let {
  isLoggedIn
} = require("../middleware/index.js");

/* GET users listing. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render("dashboard")
});

router.get('/roleAssignment', isLoggedIn, function (req, res, next) {
  db.User.find({})
    .then(foundUsers => {
      res.render('roleAssignment', {
        foundUsers
      })
    })
    .catch(err => console.log(err))
})

router.put('/roleAssignment', isLoggedIn, function (req, res) {
  db.User.find({
      username: req.body.selectUser
    })
    .then(user => {
      user.forEach(eachUser => {
        eachUser.role = req.body.selectRole
        eachUser.save()
      })
      res.redirect('/users/roleAssignment')
    })
    .catch(err => {
      console.log(err)
    })
})



module.exports = router;