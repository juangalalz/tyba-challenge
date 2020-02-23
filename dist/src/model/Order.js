'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongoosePaginate = require('mongoose-paginate');

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.set('orderCreateIndex', true);
var orderSchema = _mongoose2.default.Schema({
  orderNumber: {
    type: String,
    index: true,
    unique: true
  },
  businessName: String,
  nit: String,
  billingAddress: String,
  city: String,
  phone: String,
  email: String,
  billingEmail: String,
  shippingAddress: String,
  shippingCity: String,
  terms: String,
  dispatchDate: {
    type: Date,
    default: Date.now
  },
  observations: String,
  totalRefs: Number,
  totalMeters: Number,
  totalCOP: Number,
  finalized: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 1
  }, // 0 => en proceso, 1 => Finalizado
  clientCode: String,
  client: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  sellerName: String,
  sellerEmail: String,
  seller: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Seller'
  },
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
orderSchema.plugin(_mongoosePaginate2.default);

var Order = _mongoose2.default.model('Order', orderSchema);

// se exporta el nuevo modelo
exports.default = Order;