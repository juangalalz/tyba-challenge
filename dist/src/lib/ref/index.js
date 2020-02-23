'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Ref = require('src/model/Ref');

var _Ref2 = _interopRequireDefault(_Ref);

var _mongoose = require('mongoose');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ref = function () {
	function Ref() {
		_classCallCheck(this, Ref);
	}

	_createClass(Ref, [{
		key: 'getRefs',
		value: function getRefs(params) {
			var page = params.page || 1;
			delete params.page;
			var limit = 20;

			if (params.search) {
				params.$or = [{
					idRef: {
						$regex: ".*" + params.search + ".*",
						$options: 'i'
					}
				}, {
					reference: {
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

			return _Ref2.default.paginate(params, { page: page, limit: limit, sort: { 'createdAt': -1 } }).then(function (response) {
				return Promise.resolve(response);
			}).catch(function (e) {
				return Promise.reject(e);
			});
		}
	}, {
		key: 'addRef',
		value: function addRef(refData) {
			return _Ref2.default.findOne({ idRef: refData.idRef }).exec().then(function (ref) {
				if (ref) {
					// la referencia ya existe no se puede registrar de nuevo
					return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN });
				} else {
					var newRef = new _Ref2.default();

					newRef.idRef = refData['idRef'];
					newRef.reference = refData['reference'];

					return newRef.save();
				}
			}).then(function (newRef) {
				return Promise.resolve({ newRef: newRef });
			}).catch(function (e) {
				console.log("e", e);
				return Promise.reject(e);
			});
		}
	}, {
		key: 'updateRef',
		value: function updateRef(id, newData) {

			return _Ref2.default.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }).exec().then(function (ref) {
				// se encontró el usuario
				if (ref) {
					return Promise.resolve({ ref: ref });
				} else {
					return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.NOT_FOUND });
				}
			}).catch(function (e) {
				return Promise.reject(e);
			});
		}
	}, {
		key: 'createBulk',
		value: function createBulk() {
			return new Promise(function (resolve, reject) {
				var parser = (0, _csvParse2.default)({ delimiter: ',' }, function (err, data) {
					if (err) return reject(err);
					var newRefArray = [];
					for (var index in data) {
						var newRef = {
							idRef: data[index][0],
							reference: data[index][1]
						};
						newRefArray.push(newRef);
					}
					_Ref2.default.insertMany(newRefArray).then(function (ref) {
						return resolve(ref);
					}).catch(function (e) {
						return reject(err);
					});
				});
				_fs2.default.createReadStream(__dirname + '/../../../../bulkdata/bulkrefs.csv').pipe(parser);
			});
		}
	}]);

	return Ref;
}();

exports.default = Ref;