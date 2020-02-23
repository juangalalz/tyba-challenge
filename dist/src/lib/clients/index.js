'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Client = require('src/model/Client');

var _Client2 = _interopRequireDefault(_Client);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongoose = require('mongoose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
	function Client() {
		_classCallCheck(this, Client);
	}

	_createClass(Client, [{
		key: 'getClients',
		value: function getClients(params) {
			var page = params.page || 1;
			delete params.page;
			var limit = 20;

			if (params.search) {
				params.$or = [{
					code: {
						$regex: ".*" + params.search + ".*",
						$options: 'i'
					}
				}, {
					email: {
						$regex: ".*" + params.search + ".*",
						$options: 'i'
					}
				}, {
					nit: {
						$regex: ".*" + params.search + ".*",
						$options: 'i'
					}
				}, {
					city: {
						$regex: ".*" + params.search + ".*",
						$options: 'i'
					}
				}, {
					businessName: {
						$regex: ".*" + params.search + ".*",
						$options: 'i'
					}
				}, {
					phone: {
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

			return _Client2.default.paginate(params, { page: page, limit: limit, sort: { 'createdAt': -1 } }).then(function (response) {
				return Promise.resolve(response);
			}).catch(function (e) {
				return Promise.reject(e);
			});
		}
	}, {
		key: 'addClientByEmail',
		value: function addClientByEmail(clientData) {
			return _Client2.default.findOne({ email: clientData.email }).exec().then(function (client) {
				if (client) {
					// el usuario ya existe no se puede registrar de nuevo
					return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN });
				} else {
					var newClient = new _Client2.default();
					newClient.code = clientData['code'];
					newClient.email = clientData['email'];
					newClient.nit = clientData['nit'];
					newClient.city = clientData['city'];
					newClient.billingAddress = clientData['billingAddress'];
					newClient.businessName = clientData['businessName'];
					newClient.phone = clientData['phone'];
					newClient.terms = clientData['terms'];
					newClient.approved = clientData['approved'];
					newClient.sellerName = clientData['sellerName'];
					newClient.seller = new _mongoose.Types.ObjectId(clientData.sellerId);

					if (clientData.shippingAddress) {
						newClient.shippingAddress = clientData['shippingAddress'];
					}

					if (clientData.shippingCity) {
						newClient.shippingCity = clientData['shippingCity'];
					}

					return newClient.save();
				}
			}).then(function (newClient) {
				delete newClient.password;
				delete newClient.salt;
				// registrado!, se crea el token
				var token = _jsonwebtoken2.default.sign(newClient.toJSON(), _g.configDatabase.secret);

				return Promise.resolve({ newClient: newClient, token: token });
			}).catch(function (e) {
				console.log("e", e);
				return Promise.reject(e);
			});
		}
	}, {
		key: 'updateClient',
		value: function updateClient(id, newData) {
			if (newData.sellerId) {
				newData.seller = new _mongoose.Types.ObjectId(newData.sellerId);
			}

			return _Client2.default.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }).exec().then(function (client) {
				// se encontró el usuario
				if (client) {
					delete client.password;
					delete client.salt;
					return Promise.resolve({ client: client });
				} else {
					return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.NOT_FOUND });
				}
			}).catch(function (e) {
				return Promise.reject(e);
			});
		}
	}]);

	return Client;
}();

exports.default = Client;