let express = require('express');
let router = express.Router();

let {
  isLoggedIn
} = require("../middleware/index.js");

/* GET users listing. */
router.get('/', isLoggedIn, function (req, res, next) {
  console.log("===============================")
  console.log(req.user)
  console.log("===============================")
  res.render("dashboard")
});

router.get('/roleAssignment', isLoggedIn, function (req, res, next) {
  res.render('roleAssignment')
})

module.exports = router;