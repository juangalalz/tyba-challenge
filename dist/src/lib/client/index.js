'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Client = require('src/model/Client');

var _Client2 = _interopRequireDefault(_Client);

var _Seller = require('src/model/Seller');

var _Seller2 = _interopRequireDefault(_Seller);

var _mongoose = require('mongoose');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
  function Client() {
    _classCallCheck(this, Client);

    // create reusable transporter object using the default SMTP transport
    this.transporter = _nodemailer2.default.createTransport({
      service: 'gmail',
      auth: {
        user: 't3textilesmailer@gmail.com',
        pass: 't3textilesmailer12345'
      }
    });
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
        }, {
          sellerName: {
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

      if (params.seller) {
        if (params.seller === '5dd6902da89b7222ecc7baef' || params.seller === '5dd69097a89b7222ecc7baf0' || params.seller === '5e3ae0a57691ed67d37eb41f' || params.seller === '5dd7eb23b9e9a9a569aeb079' || params.seller === '5dd69108a89b7222ecc7baf1') {
          delete params.seller;
        }
      }

      return _Client2.default.paginate(params, { page: page, limit: limit, sort: { 'createdAt': -1 } }).then(function (response) {
        return Promise.resolve(response);
      }).catch(function (e) {
        return Promise.reject(e);
      });
    }
  }, {
    key: 'addClientByEmail',
    value: function addClientByEmail(clientData) {
      var _this = this;

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

      return newClient.save().then(function (newClient) {
        if (newClient.approved === 0) {
          _this.sendNewClientEmail(newClient.sellerName, newClient.businessName);
        }
        return Promise.resolve({ newClient: newClient });
      }).catch(function (e) {
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
  }, {
    key: 'createBulk',
    value: function createBulk() {
      return _Seller2.default.find({}).exec().then(function (sellers) {
        // console.log('sellers', sellers)
        // return Promise.resolve(sellers);
        return new Promise(function (resolve, reject) {
          var parser = (0, _csvParse2.default)({ delimiter: ',' }, function (err, data) {
            if (err) return reject(err);
            var newClientArray = [];

            var _loop = function _loop(index) {
              var seller = sellers.find(function (seller) {
                return seller.code == data[index][8];
              });
              var newClient = {
                code: data[index][0],
                businessName: data[index][1],
                nit: data[index][2],
                city: data[index][3],
                billingAddress: data[index][4],
                email: data[index][5],
                phone: data[index][6],
                terms: data[index][7],
                seller: new _mongoose.Types.ObjectId(seller._id),
                sellerName: seller.name + ' ' + seller.lastName,
                approved: 1
              };
              newClientArray.push(newClient);
            };

            for (var index in data) {
              _loop(index);
            }
            // return resolve(newClientArray);
            _Client2.default.insertMany(newClientArray).then(function (client) {
              return resolve(client);
            }).catch(function (e) {
              return reject(err);
            });
          });
          _fs2.default.createReadStream(__dirname + '/../../../../bulkdata/bulkclients.csv').pipe(parser);
        });
      }).catch(function (e) {
        return Promise.reject(e);
      });
    }
  }, {
    key: 'sendNewClientEmail',
    value: function sendNewClientEmail(sellerName, clientName) {
      // setup email data with unicode symbols
      var mailOptions = {
        from: '"T3 Textiles" <t3textilesmailer@gmail.com>', // sender address
        to: 'gestionhumana@t3textiles.com.co, direccionsistemas@t3textiles.com.co', // list of receivers
        // to: `juangalalz93@gmail.com`, // list of receivers
        subject: 'Aprobaci\xF3n de cliente', // Subject line
        text: 'El vendedor ' + sellerName + ' ha creado al nuevo cliente ' + clientName + '\n\nPara crear nuevas ordenes a este cliente, se debe aprobar el cliente desde el administrador', // plain text body
        html: 'El vendedor ' + sellerName + ' ha creado al nuevo cliente ' + clientName + '<br/><br/>\n      Para crear nuevas ordenes a este cliente, se debe aprobar el cliente desde el administrador'
      };

      // send mail with defined transport object
      this.transporter.sendMail(mailOptions, function (error, info) {});
    }
  }]);

  return Client;
}();

exports.default = Client;