import passport from 'passport';
import passportJWT from "passport-jwt";
import {Strategy as LocalStrategy} from 'passport-local';
import UserModel from 'src/model/User'

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;


passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, cb) => //Assume there is a DB module pproviding a global UserModel
    UserModel.findOne({email: email}).exec()
        .then(user => {
            if (!user) {
                return cb(null, false, {message: 'Incorrect email or password.'});
            }

            let pass = _g.utils.shaEncrypt(user.salt + password)

            if (user.password != pass) {
              return cb(null, false, {message: 'Incorrect email or password.'});
            }

            return cb(null, user.toJSON(), {
                message: 'Logged In Successfully'
            });
        })
        .catch(err => {
            return cb(err);
        })
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : _g.configDatabase.secret
    },
    (jwtPayload, cb) => //find the seller in db if needed
    {
        return cb(null, jwtPayload);
    }
));
