var createError = require("http-errors");
var express = require("express");
var exphbs = require("express-handlebars");

var path = require("path");
var cookieParser = require("cookie-parser");

var logger = require("morgan");

var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

var passport = require("passport");
var flash = require("connect-flash");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");

var mysql = require("mysql");

var myConnection = require("express-myconnection"); // express-myconnection module
var dbOptions = {
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
  database: "express-mysql"
};

var sessionStore = new MySQLStore(dbOptions);

var app = express();
require("./config/passport");

// view engine setup
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "layout",
    extname: ".hbs"
  })
);
app.set("view engine", ".hbs");

app.use(myConnection(mysql, dbOptions, "pool"));

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());

app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000000
    }
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));


app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

app.use("/users", usersRouter);
app.use("/admin", adminRouter);
app.use("/", indexRouter);


app.use("/category-", function (req, res, next) {
  res.locals.currentUrl = req.originalUrl;
  next();
});

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;