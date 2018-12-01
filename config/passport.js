var passport = require('passport');

// var User = require();

var LocalStrategy = require('passport-local').Strategy;

//used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function (req, id, done) {
    console.log('hi')
    req.getConnection(function (err, connection) {
        if (err) return next(err);
        connection.query(`SELECT * FROM users WHERE id='${id}'`, function (err, rows) {
            console.log(rows)
            done(err, rows);
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
            connection.query(addUserQuery, [], function (err, result) {
                if (err) {
                    return done(err)
                }
                return done(null, result)
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
                    console.log('ok')
                    return done(null, user)
                } else {
                    console.log('Password is not correct');
                    return done(null, false, {
                        message: 'Password is not correct'
                    });
                }
            } else {
                console.log('No such user in database');
                return done(null, false, {
                    message: 'No such user in database'
                });
            }
        });
    });
}));
/**End Sign In (Login) Strategy */