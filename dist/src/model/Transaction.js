'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongoosePaginate = require('mongoose-paginate');

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transactionSchema = _mongoose2.default.Schema({
  method: String,
  uri: String,
  query: String,
  headers: String,
  body: String,
  email: String,
  user: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
transactionSchema.plugin(_mongoosePaginate2.default);

var Transaction = _mongoose2.default.model('Transaction', transactionSchema);

// se exporta el nuevo modelo
exports.default = Transaction;