'use strict';

var _globals = require('src/common/globals');

var _globals2 = _interopRequireDefault(_globals);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _api = require('src/api');

var _api2 = _interopRequireDefault(_api);

require('src/passport');

var _login = require('src/auth/login');

var _login2 = _interopRequireDefault(_login);

var _transaction = require('src/lib/transaction');

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = _bluebird2.default;

_mongoose2.default.connect(process.env.MONGOLAB_URI || _g.configDatabase.database, { useNewUrlParser: true });
var app = (0, _express2.default)();
var transactions = new _transaction2.default();

// corss
app.use((0, _cors2.default)());
var port = process.env.PORT || _g.configDatabase.port;
var db = _mongoose2.default.connection;

db.once('open', function () {
	// parse application/x-www-form-urlencoded
	app.use(_bodyParser2.default.urlencoded({ extended: false }));

	// parse application/json
	app.use(_bodyParser2.default.json());

	app.use(function (req, res, next) {
		_passport2.default.authenticate('jwt', { session: false }, function (err, user, info) {
			transactions.addTransaction(req, user);
			next();
		})(req, res, next);
	});

	app.use('/auth', _login2.default);
	app.use('/api', _passport2.default.authenticate('jwt', { session: false }), _api2.default);
	app.get('/', function (req, res) {
		res.send('Tyba Challenge!');
	});

	app.listen(port, function () {
		console.log('Server listening on port ' + port);
	});
});