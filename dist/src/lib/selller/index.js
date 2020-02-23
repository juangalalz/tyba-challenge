'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Seller = require('src/model/Seller');

var _Seller2 = _interopRequireDefault(_Seller);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _uniqid = require('uniqid');

var _uniqid2 = _interopRequireDefault(_uniqid);

var _mongoose = require('mongoose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Seller = function () {
	function Seller() {
		_classCallCheck(this, Seller);
	}

	_createClass(Seller, [{
		key: 'getSellers',
		value: function getSellers(params) {
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
					identificationCard: {
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

			return _Seller2.default.paginate(params, { page: page, limit: limit, sort: { 'createdAt': -1 } }).then(function (response) {
				return Promise.resolve(response);
			}).catch(function (e) {
				return Promise.reject(e);
			});
		}
	}, {
		key: 'addSellerByEmail',
		value: function addSellerByEmail(sellerData) {
			return _Seller2.default.findOne({ email: sellerData.email }).exec().then(function (seller) {
				if (seller) {
					// el usuario ya existe no se puede registrar de nuevo
					return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN });
				} else {
					var newSeller = new _Seller2.default();

					newSeller.code = sellerData['code'];
					newSeller.email = sellerData['email'];
					newSeller.identificationCard = sellerData['identificationCard'];
					newSeller.name = sellerData['name'];
					newSeller.lastName = sellerData['lastName'];
					newSeller.phone = sellerData['phone'];

					return newSeller.save();
				}
			}).then(function (newSeller) {
				delete newSeller.password;
				delete newSeller.salt;
				// registrado!, se crea el token
				var token = _jsonwebtoken2.default.sign(newSeller.toJSON(), _g.configDatabase.secret);

				return Promise.resolve({ newSeller: newSeller, token: token });
			}).catch(function (e) {
				console.log("e", e);
				return Promise.reject(e);
			});
		}
	}, {
		key: 'updateSeller',
		value: function updateSeller(id, newData) {
			if (newData['password'] != null) {
				newData['salt'] = (0, _uniqid2.default)();
				newData['password'] = _g.utils.shaEncrypt(newData['salt'] + newData['password']);
			}
			// if (newData.companyId) {
			//   newData.company = new Types.ObjectId(newData.companyId)
			// }

			return _Seller2.default.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }).exec().then(function (seller) {
				// se encontró el usuario
				if (seller) {
					delete seller.password;
					delete seller.salt;
					return Promise.resolve({ seller: seller });
				} else {
					return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.NOT_FOUND });
				}
			}).catch(function (e) {
				return Promise.reject(e);
			});
		}
	}]);

	return Seller;
}();

exports.default = Seller;