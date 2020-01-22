  //all the midleware goes here
  let middlewareObj = {};

  //middleware to see if logged in
  middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      console.log('not logged in')
      res.redirect("/");
    }
  };

  module.exports = middlewareObj;