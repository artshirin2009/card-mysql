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

/**Login as Administrtator */
router.get('/', function (req, res, next) {
    var messages = req.flash('error')
    res.render('users/admin', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    })
});
router.post(
    "/",
    passport.authenticate("local.admin", {
        successRedirect: "/users/authorized",
        failureRedirect: "/admin",
        failureFlash: true
    })
);
/** End Login as Administrtator */

module.exports = router;