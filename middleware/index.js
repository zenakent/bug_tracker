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

  middlewareObj.isAdmin = function (req, res, next) {
    console.log(req.user.role)
    if (req.user.role === 'admin') {
      return next();
    } else {
      console.log('not admin')
      //should redirect to an unauthorized page
      res.render('http_response/401page')
    }
  };

  middlewareObj.isProjectManager = function (req, res, next) {
    console.log(req.user.role)
    if (req.user.role === 'project_manager') {
      return next();
    } else {
      console.log('not project_manager')
      res.render('http_response/401page')
    }
  };

  middlewareObj.isDeveloper = function (req, res, next) {
    console.log(req.user.role)
    if (req.user.role === 'developer') {
      return next();
    } else {
      console.log('not developer')
      res.render('http_response/401page')
    }
  };

  module.exports = middlewareObj;