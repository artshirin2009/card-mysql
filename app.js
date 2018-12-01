var createError = require('http-errors');
var express = require('express');
var exphbs = require('express-handlebars');


var path = require('path');
var cookieParser = require('cookie-parser');

var logger = require('morgan');

var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash')

var indexRouter = require('./routes/index');


var mysql = require('mysql');

var myConnection = require('express-myconnection'); // express-myconnection module
dbOptions = {
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  database: 'express-mysql'
};




var app = express();
require('./config/passport')

// view engine setup
app.engine('.hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(myConnection(mysql, dbOptions, 'pool'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(session({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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