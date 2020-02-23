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

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Seller = function () {
  function Seller() {
    _classCallCheck(this, Seller);

    // create reusable transporter object using the default SMTP transport
    this.transporter = _nodemailer2.default.createTransport({
      service: 'gmail',
      auth: {
        user: 't3textilesmailer@gmail.com',
        pass: 't3textilesmailer12345'
      }
    });
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
          newSeller.salt = (0, _uniqid2.default)();
          newSeller.password = _g.utils.shaEncrypt(newSeller.salt + newSeller.identificationCard);
          newSeller.temporalPassword = 1;
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
  }, {
    key: 'sendRestoreEmail',
    value: function sendRestoreEmail(email, name, password, cb) {
      // setup email data with unicode symbols
      var mailOptions = {
        // from: '"Manuela Botero" <manuelabotero@palmacea.com.co>', // sender address
        from: '"T3 Textiles" <t3textilesmailer@gmail.com>', // sender address
        to: '' + email, // list of receivers
        // to: `juangalalz93@gmail.com`, // list of receivers
        subject: 'Recuperaci\xF3n de contrase\xF1a', // Subject line
        text: 'Hola ' + name + ',\n\nSe te ha asignado una contrase\xF1a temporal, con la cual puedes ingresar y establecer una nueva contrase\xF1a\n\nContrase\xF1a temporal: ' + password + '.\n\nGracias por usar nuestros servicios electr\xF3nicos.', // plain text body
        html: 'Hola ' + name + ',<br/><br/>\n      Se te ha asignado una contrase\xF1a temporal, con la cual puedes ingresar y establecer una nueva contrase\xF1a<br/><br/>\n      Contrase\xF1a temporal: <b>' + password + '</b><br/><br/>\n      Gracias por usar nuestros servicios electr\xF3nicos.'
      };

      // send mail with defined transport object
      this.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return cb(error);
        }
        return cb(false, 'delivered');
      });
    }
  }, {
    key: 'createBulk',
    value: function createBulk() {
      return new Promise(function (resolve, reject) {
        var parser = (0, _csvParse2.default)({ delimiter: ',' }, function (err, data) {
          if (err) return reject(err);
          var newSellerArray = [];
          for (var index in data) {
            var newSeller = {
              code: data[index][0],
              name: data[index][1],
              lastName: data[index][2],
              email: data[index][3],
              phone: data[index][4],
              identificationCard: data[index][5],
              salt: (0, _uniqid2.default)(),
              temporalPassword: 1
            };
            newSeller['password'] = _g.utils.shaEncrypt(newSeller.salt + newSeller.identificationCard);
            newSellerArray.push(newSeller);
          }
          _Seller2.default.insertMany(newSellerArray).then(function (seller) {
            return resolve(seller);
          }).catch(function (e) {
            return reject(err);
          });
        });
        _fs2.default.createReadStream(__dirname + '/../../../../bulkdata/bulksellers.csv').pipe(parser);
      });
    }
  }]);

  return Seller;
}();

exports.default = Seller;