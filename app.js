require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportLocalMongoose = require('passport-local-mongoose')
const methodOverride = require("method-override"); //Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
const flash = require("connect-flash");



//requiring routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const projectRouter = require('./routes/projects');
const ticketRouter = require('./routes/tickets');
const commentRouter = require('./routes/comments');
const manageUsersProjectRouter = require('./routes/manageProjectUsers')
const chartsApiRouter = require('./routes/chartsAPI')
const manageUsersRouter = require('./routes/manageUsers')
const profileRouter = require('./routes/profile')
const notificationsRouter = require('./routes/notifications')

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

//import models
const db = require("./models");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(flash());

app.use(require('express-session')({
  secret: '348956y734h563k4j6',
  resave: false,
  saveUninitialized: false
}))

//use socket.io on routes
app.use(function (req, res, next) {
  res.io = io;
  next();
});


app.use(require("express-session")({
  secret: "sjkldbgk;sjfbnghsjk;brnhgk;rf",
  resave: false,
  saveUninitialized: false
}));

//use passport 
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(db.User.serializeUser())
passport.deserializeUser(db.User.deserializeUser())
passport.use(new LocalStrategy({
  usernameField: 'email'
}, db.User.authenticate()));


//locals
app.use(async function (req, res, next) {
  res.locals.currentUser = req.user
  if (req.user) {
    try {
      const user = await db.User.findById(req.user._id).populate('notifications', null, {
        isRead: false
      }).exec()
      res.locals.notifications = user.notifications
    } catch (error) {
      console.log(err);
    }
  }
  res.locals.err_msg = req.flash("error");
  res.locals.success_msg = req.flash("success");
  next()
})
app.locals.moment = require('moment')



//initialize routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectRouter);
app.use('/tickets', ticketRouter);
app.use('/comments', commentRouter);
app.use('/manageProjectUsers', manageUsersProjectRouter);
app.use('/api/charts', chartsApiRouter);
app.use('/manageUsers', manageUsersRouter);
app.use('/profile', profileRouter);
app.use('/notifications', notificationsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.render('http_response/404page');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// module.exports = app;
module.exports = {
  app: app,
  server: server
};