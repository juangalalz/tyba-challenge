'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _user = require('src/lib/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var users = new _user2.default();

/* POST login. */
router.post('/login', function (req, res, next) {

    _passport2.default.authenticate('local', { session: false }, function (err, user, info) {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user
            });
        }

        req.login(user, { session: false }, function (err) {
            if (err) {
                res.send(err);
            }

            var token = _jsonwebtoken2.default.sign(user, _g.configDatabase.secret);

            return res.json({ user: user, token: token });
        });
    })(req, res);
});

/* POST sign up. */
router.post('/sign-up', function (req, res) {
    var body = {
        name: req.body.name ? _g.validator.escape(_g.validator.trim(req.body.name)) : '',
        lastName: req.body.lastName ? _g.validator.escape(_g.validator.trim(req.body.lastName)) : '',
        email: req.body.email && _g.validator.isEmail(req.body.email) ? _g.validator.escape(_g.validator.trim(req.body.email)) : null,
        password: req.body.password ? _g.validator.escape(_g.validator.trim(req.body.password)) : null
    };
    var areFieldsRight = body.password && body.email && body.name && body.lastName;
    // validamos los fields requeridos
    if (areFieldsRight) {
        users.addUserByEmail(body).then(function (response) {
            res.json(response);
        }).catch(function (e) {
            res.status(_g.constants.ERROR_CODES.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                error: e
            });
        });
    } else {
        res.status(_g.constants.ERROR_CODES.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: _g.constants.RESPONSES.MISSING_FIELDS_OR_WRONG_INPUTS
        });
    }
});

exports.default = router;