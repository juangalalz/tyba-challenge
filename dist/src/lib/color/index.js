'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Color = require('src/model/Color');

var _Color2 = _interopRequireDefault(_Color);

var _Ref = require('src/model/Ref');

var _Ref2 = _interopRequireDefault(_Ref);

var _mongoose = require('mongoose');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Color = function () {
  function Color() {
    _classCallCheck(this, Color);
  }

  _createClass(Color, [{
    key: 'getColors',
    value: function getColors(params) {
      var page = params.page || 1;
      delete params.page;
      var limit = params.limit || 20;
      delete params.limit;
      limit = parseInt(limit);
      page = parseInt(page);
      if (params.search) {
        params.$or = [{
          name: {
            $regex: ".*" + params.search + ".*",
            $options: 'i'
          }
        }, {
          color: {
            $regex: ".*" + params.search + ".*",
            $options: 'i'
          }
        }, {
          refName: {
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
      return _Color2.default.paginate(params, { page: page, limit: limit, sort: { 'name': 1 } }).then(function (response) {
        return Promise.resolve(response);
      }).catch(function (e) {
        return Promise.reject(e);
      });
    }
  }, {
    key: 'addColor',
    value: function addColor(colorData) {
      var newColor = new _Color2.default();
      newColor.refName = colorData['refName'];
      newColor.ref = new _mongoose.Types.ObjectId(colorData.refId);
      newColor.name = colorData['name'];
      newColor.color = colorData['color'];
      newColor.status = colorData['status'];

      return newColor.save().then(function (color) {
        return Promise.resolve({ color: color });
      }).catch(function (e) {
        return Promise.reject(e);
      });
    }
  }, {
    key: 'updateColor',
    value: function updateColor(id, newData) {
      if (newData.refId) {
        newData.ref = new _mongoose.Types.ObjectId(newData.refId);
      }

      return _Color2.default.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }).exec().then(function (color) {
        // se encontró el usuario
        if (color) {
          return Promise.resolve({ color: color });
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
      return _Ref2.default.find({}).exec().then(function (refs) {
        // console.log('refs', refs)
        // return Promise.resolve(refs);
        return new Promise(function (resolve, reject) {
          var parser = (0, _csvParse2.default)({ delimiter: ',' }, function (err, data) {
            if (err) return reject(err);
            var newColorArray = [];

            var _loop = function _loop(index) {
              var colorArray = data[index][0].split('-');
              var ref = refs.find(function (ref) {
                return ref.reference == colorArray[0];
              });
              var newColor = {
                name: colorArray[1],
                color: colorArray[2],
                status: 1,
                ref: ref ? new _mongoose.Types.ObjectId(ref._id) : null,
                refName: ref ? ref.reference : null,
                refNameTemp: colorArray[0]
              };
              newColorArray.push(newColor);
            };

            for (var index in data) {
              _loop(index);
            }
            // return resolve(newColorArray);
            _Color2.default.insertMany(newColorArray).then(function (color) {
              return resolve(color);
            }).catch(function (e) {
              return reject(err);
            });
          });
          _fs2.default.createReadStream(__dirname + '/../../../../bulkdata/bulkcolors.csv').pipe(parser);
        });
      }).catch(function (e) {
        return Promise.reject(e);
      });
    }
  }]);

  return Color;
}();

exports.default = Color;