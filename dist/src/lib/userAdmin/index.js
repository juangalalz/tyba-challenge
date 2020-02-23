'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _UserAdmin = require('src/model/UserAdmin');

var _UserAdmin2 = _interopRequireDefault(_UserAdmin);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _uniqid = require('uniqid');

var _uniqid2 = _interopRequireDefault(_uniqid);

var _mongoose = require('mongoose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserAdmin = function () {
	function UserAdmin() {
		_classCallCheck(this, UserAdmin);
	}

	_createClass(UserAdmin, [{
		key: 'getUserAdmins',
		value: function getUserAdmins(params) {
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

			return _UserAdmin2.default.paginate(params, { page: page, limit: limit, sort: { 'createdAt': -1 } }).then(function (response) {
				return Promise.resolve(response);
			}).catch(function (e) {
				return Promise.reject(e);
			});
		}
	}, {
		key: 'addUserAdminByEmail',
		value: function addUserAdminByEmail(userAdminData) {
			return _UserAdmin2.default.findOne({ email: userAdminData.email }).exec().then(function (userAdmin) {
				if (userAdmin) {
					// el usuario ya existe no se puede registrar de nuevo
					return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN });
				} else {
					var newUserAdmin = new _UserAdmin2.default();

					newUserAdmin.email = userAdminData['email'];
					newUserAdmin.name = userAdminData['name'];
					newUserAdmin.lastName = userAdminData['lastName'];
					newUserAdmin.salt = (0, _uniqid2.default)();
					newUserAdmin.password = _g.utils.shaEncrypt(newUserAdmin.salt + userAdminData.password);

					return newUserAdmin.save();
				}
			}).then(function (newUserAdmin) {
				delete newUserAdmin.password;
				delete newUserAdmin.salt;
				// registrado!, se crea el token
				var token = _jsonwebtoken2.default.sign(newUserAdmin.toJSON(), _g.configDatabase.secret);

				return Promise.resolve({ newUserAdmin: newUserAdmin, token: token });
			}).catch(function (e) {
				console.log("e", e);
				return Promise.reject(e);
			});
		}
	}, {
		key: 'updateUserAdmin',
		value: function updateUserAdmin(id, newData) {
			if (newData['password'] != null) {
				newData['salt'] = (0, _uniqid2.default)();
				newData['password'] = _g.utils.shaEncrypt(newData['salt'] + newData['password']);
			}
			// if (newData.companyId) {
			//   newData.company = new Types.ObjectId(newData.companyId)
			// }

			return _UserAdmin2.default.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }).exec().then(function (userAdmin) {
				// se encontró el usuario
				if (userAdmin) {
					delete userAdmin.password;
					delete userAdmin.salt;
					return Promise.resolve({ userAdmin: userAdmin });
				} else {
					return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.NOT_FOUND });
				}
			}).catch(function (e) {
				return Promise.reject(e);
			});
		}
	}]);

	return UserAdmin;
}();

exports.default = UserAdmin;