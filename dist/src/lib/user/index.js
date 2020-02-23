'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _User = require('src/model/User');

var _User2 = _interopRequireDefault(_User);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _uniqid = require('uniqid');

var _uniqid2 = _interopRequireDefault(_uniqid);

var _mongoose = require('mongoose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {
	function User() {
		_classCallCheck(this, User);
	}

	_createClass(User, [{
		key: 'getUsers',
		value: function getUsers(params) {
			var page = params.page || 1;
			delete params.page;
			var limit = 20;

			if (params.search) {
				params.$or = [{
					email: {
						$regex: ".*" + params.search + ".*",
						$options: 'i'
					}
				}, {
					name: {
						$regex: ".*" + params.search + ".*",
						$options: 'i'
					}
				}, {
					lastName: {
						$regex: ".*" + params.search + ".*",
						$options: 'i'
					}
				}];
				if (_mongoose.Types.ObjectId.isValid(params.search)) {
					params.$or.push({
						_id: params.search
					});
				}
				delete params.search;
			}

			params['deleted'] = 0;

			return _User2.default.paginate(params, { page: page, limit: limit, sort: { 'createdAt': -1 } }).then(function (response) {
				return Promise.resolve(response);
			}).catch(function (e) {
				return Promise.reject(e);
			});
		}
	}, {
		key: 'addUserByEmail',
		value: function addUserByEmail(userData) {
			return _User2.default.findOne({ email: userData.email }).exec().then(function (user) {
				if (user) {
					// el usuario ya existe no se puede registrar de nuevo
					return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN });
				} else {
					var newUser = new _User2.default();

					newUser.email = userData['email'];
					newUser.name = userData['name'];
					newUser.lastName = userData['lastName'];
					newUser.salt = (0, _uniqid2.default)();
					newUser.password = _g.utils.shaEncrypt(newUser.salt + userData.password);

					return newUser.save();
				}
			}).then(function (newUser) {
				delete newUser.password;
				delete newUser.salt;
				// registrado!, se crea el token
				var token = _jsonwebtoken2.default.sign(newUser.toJSON(), _g.configDatabase.secret);

				return Promise.resolve({ newUser: newUser, token: token });
			}).catch(function (e) {
				console.log("e", e);
				return Promise.reject(e);
			});
		}
	}, {
		key: 'updateUser',
		value: function updateUser(id, newData) {
			if (newData['password'] != null) {
				newData['salt'] = (0, _uniqid2.default)();
				newData['password'] = _g.utils.shaEncrypt(newData['salt'] + newData['password']);
			}
			// if (newData.companyId) {
			//   newData.company = new Types.ObjectId(newData.companyId)
			// }

			return _User2.default.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }).exec().then(function (user) {
				// se encontró el usuario
				if (user) {
					delete user.password;
					delete user.salt;
					return Promise.resolve({ user: user });
				} else {
					return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.NOT_FOUND });
				}
			}).catch(function (e) {
				return Promise.reject(e);
			});
		}
	}]);

	return User;
}();

exports.default = User;