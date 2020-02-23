'use strict';

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportJwt = require('passport-jwt');

var _passportJwt2 = _interopRequireDefault(_passportJwt);

var _passportLocal = require('passport-local');

var _User = require('src/model/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ExtractJWT = _passportJwt2.default.ExtractJwt;
var JWTStrategy = _passportJwt2.default.Strategy;

_passport2.default.use(new _passportLocal.Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, cb) {
    return (//Assume there is a DB module pproviding a global UserModel
        _User2.default.findOne({ email: email }).exec().then(function (user) {
            if (!user) {
                return cb(null, false, { message: 'Incorrect email or password.' });
            }

            var pass = _g.utils.shaEncrypt(user.salt + password);

            if (user.password != pass) {
                return cb(null, false, { message: 'Incorrect email or password.' });
            }

            return cb(null, user.toJSON(), {
                message: 'Logged In Successfully'
            });
        }).catch(function (err) {
            return cb(err);
        })
    );
}));

_passport2.default.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: _g.configDatabase.secret
}, function (jwtPayload, cb) //find the seller in db if needed
{
    return cb(null, jwtPayload);
}));