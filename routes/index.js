var express = require("express");
var router = express.Router();

var csrf = require("csurf");
var csrfProtection = csrf({
  cookie: true
});

var passport = require('passport')


var productsQuery = "SELECT * FROM airshop";
var usersQuery = "SELECT * FROM users";
router.use(csrfProtection);

/* GET home page. */
router.get("/", function (req, res, next) {
  req.getConnection(function (err, connection) {
    if (err) return next(err);
    connection.query(productsQuery, [], function (err, results) {
      if (err) return next(err);
      res.render("shop/index", {
        title: "Shop",
        products: results
      });
    });
  });
});
/**Registration (SignUp) */
router.get("/users/signup", function (req, res, next) {
  res.render("users/signup", {
    csrfToken: req.csrfToken()
  });
});
router.post("/users/signup", passport.authenticate('local.signup', {
  successRedirect: '/',
  failureRedirect: '/users/signup',
  failureFlash: true
}));
// router.post("/users/signup", function (req, res, next) {
//   req.getConnection(function (err, connection) {
//     if (err) return next(err);
//     var userEmail = req.body.email;
//     var userPassword = req.body.password;
//     var userRole = req.body.role;
//     var addUserQuery = `INSERT INTO users (email, password, role) VALUES ('${userEmail}','${userPassword}', '${userRole}')`;
//     connection.query(addUserQuery, [], function (err, results) {
//       if (err) return next(err);
//       res.redirect("users/authorized");
//     });
//   });
// });



/** END Registration (SignUp) */

/**Login (SignIn) */
router.get("/users/login", function (req, res, next) {
  res.render("users/login", {
    csrfToken: req.csrfToken()
  });
});

router.post('/users/login', passport.authenticate('local.login', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}));
/** END Login (SignIn) */

/**Get all Users */
router.get("/users/authorized", function (req, res, next) {
  req.getConnection(function (err, connection) {
    if (err) return next(err);
    connection.query(usersQuery, [], function (err, results) {
      if (err) return next(err);
      res.render("users/authorized", {
        title: "Authorized Users",
        users: results
      });
    });
  });
});
/**Get all Users */
module.exports = router;