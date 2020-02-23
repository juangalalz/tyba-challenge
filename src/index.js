import globals from 'src/common/globals'
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import bluebird from 'bluebird'
import cors from 'cors';
import passport from 'passport';

import api from 'src/api'
import 'src/passport'
import auth from 'src/auth/login';
import Transaction from 'src/lib/transaction'

mongoose.Promise = bluebird

mongoose.connect(process.env.MONGOLAB_URI || _g.configDatabase.database, { useNewUrlParser: true });
const app = express()
const transactions = new Transaction()

	// corss
app.use(cors())
const port = process.env.PORT || _g.configDatabase.port
let db = mongoose.connection;

db.once('open', () => {
	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }))

	// parse application/json
	app.use(bodyParser.json())

	app.use((req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
      transactions.addTransaction(req, user)
      next()
    })(req, res, next)
  })

	app.use('/auth', auth);
  app.use('/api', passport.authenticate('jwt', {session: false}), api)
	app.get('/', (req, res) => {
		res.send('Tyba Challenge!')
	})

	app.listen(port, () => {
		console.log(`Server listening on port ${port}`)
	})
});
