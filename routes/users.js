var express = require("express");
var router = express.Router();

var csrf = require("csurf");
var csrfProtection = csrf({
  cookie: true
});

var passport = require("passport");

var productsQuery = "SELECT * FROM airshop";

var usersQuery = "SELECT * FROM users";
var Cart = require("../models/cart");

var additionalFunc = require("../config/additionalFunc")

router.use(csrfProtection);

/**Registration (SignUp) */
router.get("/signup", function (req, res, next) {
  res.render("users/signup", {
    csrfToken: req.csrfToken()
  });
});
router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/",
    failureRedirect: "/users/signup",
    failureFlash: true
  })
);
/** END Registration (SignUp) */




/**Login (SignIn) */
router.get("/login", function (req, res, next) {
  res.render("users/login", {
    csrfToken: req.csrfToken()
  });
});

router.post(
  "/login",
  passport.authenticate("local.login", {
    successRedirect: "/",
    failureRedirect: "/users/login"
  })
);
/** END Login (SignIn) */

/**Logout*/
router.get("/logout", function (req, res, next) {
  req.logout();
  res.redirect("/");
});
/**End Logout */
/**Get all Users */
router.get("/authorized", additionalFunc.isLoggedIn, additionalFunc.checkingisAdmin, additionalFunc.getCategory, function (
  req,
  res,
  next
) {
  req.getConnection(function (err, connection) {
    if (err) return next(err);
    connection.query(usersQuery, [], function (err, results) {
      if (err) return next(err);
      res.render("users/authorized", {
        title: "Authorized Users",
        users: results,
        categories: true
      });
    });
  });
});

module.exports = router;