import express from 'express';
const router  = express.Router();

import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from 'src/lib/user';

const users = new User()

/* POST login. */
router.post('/login', (req, res, next) => {

    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }

            const token = jwt.sign(user, _g.configDatabase.secret);

            return res.json({user, token});
        });
    })
    (req, res);

});

/* POST sign up. */
router.post('/sign-up', (req, res) => {
    let body = {
        name: req.body.name ? _g.validator.escape(_g.validator.trim(req.body.name)) : '',
        lastName: req.body.lastName ? _g.validator.escape(_g.validator.trim(req.body.lastName)) : '',
        email: req.body.email && _g.validator.isEmail(req.body.email) ? _g.validator.escape(_g.validator.trim(req.body.email)) : null,
        password: req.body.password ? _g.validator.escape(_g.validator.trim(req.body.password)) : null,
    }
    let areFieldsRight = body.password && body.email && body.name && body.lastName
    // validamos los fields requeridos
    if (areFieldsRight) {
        users.addUserByEmail(body)
        .then((response) => {
            res.json(response)
        }).catch((e) => {
            res.status(_g.constants.ERROR_CODES.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                error: e
            })
        })
    } else {
        res.status(_g.constants.ERROR_CODES.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            error: _g.constants.RESPONSES.MISSING_FIELDS_OR_WRONG_INPUTS
        })
    }
})

export default router;
