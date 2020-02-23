'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Transaction = require('src/model/Transaction');

var _Transaction2 = _interopRequireDefault(_Transaction);

var _mongoose = require('mongoose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Transaction = function () {
  function Transaction() {
    _classCallCheck(this, Transaction);
  }

  _createClass(Transaction, [{
    key: 'getTransactions',
    value: function getTransactions(params) {
      var page = params.page || 1;
      delete params.page;
      var limit = 20;

      if (params.search) {
        params.$or = [{
          method: {
            $regex: ".*" + params.search + ".*",
            $options: 'i'
          }
        }, {
          email: {
            $regex: ".*" + params.search + ".*",
            $options: 'i'
          }
        }, {
          uri: {
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

      return _Transaction2.default.paginate(params, { page: page, limit: limit, sort: { 'createdAt': -1 } }).then(function (response) {
        return Promise.resolve(response);
      }).catch(function (e) {
        return Promise.reject(e);
      });
    }
  }, {
    key: 'addTransaction',
    value: function addTransaction(req, user) {
      var url = req._parsedUrl;

      var newTransaction = new _Transaction2.default();
      newTransaction.method = req.method;
      newTransaction.uri = url.pathname;
      newTransaction.headers = JSON.stringify(req.headers);
      newTransaction.body = JSON.stringify(req.body);
      newTransaction.query = url.query ? url.query : '';

      if (user) {
        newTransaction.user = new _mongoose.Types.ObjectId(user._id);
        newTransaction.email = user.email;
      }

      newTransaction.save();
    }
  }]);

  return Transaction;
}();

exports.default = Transaction;