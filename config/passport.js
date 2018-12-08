var passport = require('passport');

// var User = require();

var LocalStrategy = require('passport-local').Strategy;

//used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.insertId);
});

// used to deserialize the user
passport.deserializeUser(function (req, id, done) {

    req.getConnection(function (err, connection) {
        if (err) return next(err);
        connection.query(`SELECT * FROM users WHERE insertId='${id}'`, function (err, user) {

            done(err, user[0]);
        });
    })
});


/** Sign Up (Register) Strategy */
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    req.getConnection(function (err, connection) {
        if (err) return next(err);
        var userEmail = req.body.email;
        var findQuery = `SELECT * FROM users WHERE email='${userEmail}'`;
        connection.query(findQuery, function (err, user) {
            if (err) {
                return done(err)
            }
            if (user.length > 0) {
                return done(null, false, {

                    message: 'Email is already in use'
                });
            }

            var userPassword = req.body.password;
            var userRole = req.body.role;
            var addUserQuery = `INSERT INTO users (email, password, role) VALUES ('${userEmail}','${userPassword}', '${userRole}')`;
            connection.query(addUserQuery, function (err, user) {

                if (err) {
                    return done(err)
                }
                return done(null, user)
            });
        });
    });
}));
/**End Sign Up (Register) Strategy */

/** Sign In (Login) Strategy */
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    req.getConnection(function (err, connection) {
        if (err) return next(err);
        var userEmail = req.body.email;
        var findQuery = `SELECT * FROM users WHERE email='${userEmail}'`;
        connection.query(findQuery, function (err, user) {
            if (err) {
                return done(err)
            }
            if (user.length > 0) {
                if (user[0].password === req.body.password) {
                    return done(null, user[0])
                } else {
                    return done(null, false, {
                        message: 'Password is not correct'
                    });
                }
            } else {
                return done(null, false, {
                    message: 'No such user in database'
                });
            }
        });
    });
}));
/**End Sign In(Login) Strategy */

/** Sign In  Admin(Login as Administrtator) Strategy */
passport.use('local.admin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    req.getConnection(function (err, connection) {
        if (err) return next(err);
        var userEmail = req.body.email;
        var findQuery = `SELECT * FROM users WHERE email='${userEmail}'`;
        connection.query(findQuery, function (err, user) {
            if (err) {
                return done(err)
            }
            console.log('user role - ' + user[0].role)
            if (!user[0].role) {
                return done(null, false, {
                    hasErrors: true,
                    message: 'You are not administrator'
                });
            }
            if (user.length > 0) {
                if (user[0].password === req.body.password) {
                    return done(null, user[0])
                } else {
                    return done(null, false, {
                        message: 'Password is not correct'
                    });
                }
            } else {
                return done(null, false, {
                    message: 'No such user in database'
                });
            }
        });
    });
}));
/**End Sign In (Login) Strategy */