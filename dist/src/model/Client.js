'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongoosePaginate = require('mongoose-paginate');

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.set('clientCreateIndex', true);
var clientSchema = _mongoose2.default.Schema({
  code: {
    type: String,
    index: true
  },
  email: {
    type: String,
    index: true
  },
  nit: {
    type: String,
    index: true
  },
  city: String,
  billingAddress: String,
  businessName: String,
  phone: String,
  terms: String,
  shippingAddress: String,
  shippingCity: String,
  sellerName: String,
  seller: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Seller'
  },
  approved: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 2.
  }, // 0 => pediente de aprobación, 1 => Aprobado, 2 => No aprobado
  deleted: {
    type: Number,
    required: true,
    default: 0,
    min: 0, // no eliminado
    max: 1. // eliminado
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: { type: Date, default: Date.now }
});
clientSchema.plugin(_mongoosePaginate2.default);

var Client = _mongoose2.default.model('Client', clientSchema);

// se exporta el nuevo modelo
exports.default = Client;