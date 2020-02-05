let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let passport = require('passport')
let LocalStrategy = require('passport-local')
let passportLocalMongoose = require('passport-local-mongoose')
let methodOverride = require("method-override"); //Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.


//requiring routes
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let projectRouter = require('./routes/projects');
let ticketRouter = require('./routes/tickets');
let commentRouter = require('./routes/comments');
let manageUsersRouter = require('./routes/manageUsers')
let app = express();

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

app.use(require('express-session')({
  secret: '348956y734h563k4j6',
  resave: false,
  saveUninitialized: false
}))

//use passport 
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(db.User.serializeUser())
passport.deserializeUser(db.User.deserializeUser())
passport.use(new LocalStrategy(db.User.authenticate()));


//locals
app.use(function (req, res, next) {
  res.locals.currentUser = req.user
  next()
})
app.locals.moment = require('moment')



//initialize routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectRouter);
app.use('/tickets', ticketRouter);
app.use('/comments', commentRouter);
app.use('/manageUsers', manageUsersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.render('404page');
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

module.exports = app;