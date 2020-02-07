const express = require('express');
const router = express.Router();
const db = require('../models')
const passport = require('passport')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Bug Tracker'
  });
});

//register route
router.get("/register", function (req, res) {
  res.render('register', {
    title: 'Bug Tracker Register'
  })
})


router.post("/register", function (req, res) {

  db.User.register(new db.User({
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
  }), req.body.password, function (err, user) {
    if (err) {
      console.log(err)
      return res.render("register")
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/users")
    })
  })
})

//sign in as demo page
router.get("/signinasdemo", function (req, res) {
  res.render("signInasDemo")
})

//sign in as Admindemo
router.get("/signinasAdminDemo", function (req, res) {
  db.User.findOne({
    username: 'demoAdmin'
  }, function (err, user) {
    if (err) {
      console.log(err)
    } else {
      req.login(user, function (err) {
        if (err) {
          console.log(err)
        } else {
          return res.redirect("/users")
        }
      })
    }
  })
})

//sign in as Project Manager Demo
router.get("/signinasProjectManagerDemo", function (req, res) {
  db.User.findOne({
    username: 'demoProjectManager'
  }, function (err, user) {
    if (err) {
      console.log(err)
    } else {
      req.login(user, function (err) {
        if (err) {
          console.log(err)
        } else {
          return res.redirect("/users")
        }
      })
    }
  })
})

//sign in as DeveloperDemo
router.get("/signinasDeveloperDemo", function (req, res) {
  db.User.findOne({
    username: 'demoDeveloper'
  }, function (err, user) {
    if (err) {
      console.log(err)
    } else {
      req.login(user, function (err) {
        if (err) {
          console.log(err)
        } else {
          return res.redirect("/users")
        }
      })
    }
  })
})

//sign in as fakeUser
router.get("/signinasFakeUserDemo", function (req, res) {
  db.User.findOne({
    username: 'fakeuser'
  }, function (err, user) {
    if (err) {
      console.log(err)
    } else {
      req.login(user, function (err) {
        if (err) {
          console.log(err)
        } else {
          return res.redirect("/users")
        }
      })
    }
  })
})

//login route
router.post("/login", passport.authenticate("local", {
  successRedirect: "/users",
  failureRedirect: "/"
}), function (req, res) {
  console.log("MAui")
})

//logout route
router.get('/logout', function (req, res) {
  req.logout()
  res.redirect("/")
})



module.exports = router;