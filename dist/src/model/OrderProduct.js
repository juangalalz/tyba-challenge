'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongoosePaginate = require('mongoose-paginate');

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.set('orderProductCreateIndex', true);
var orderProductSchema = _mongoose2.default.Schema({
  colorNumber: String,
  colorName: String,
  color: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Color'
  },
  refName: String,
  ref: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Ref'
  },
  order: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  price: Number,
  totalPrice: Number,
  meters: Number,
  msvc: {
    type: Number,
    required: true,
    default: 0,
    min: 0, // no
    max: 1 // si
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: { type: Date, default: Date.now }
});
orderProductSchema.plugin(_mongoosePaginate2.default);

var OrderProduct = _mongoose2.default.model('OrderProduct', orderProductSchema);

// se exporta el nuevo modelo
exports.default = OrderProduct;