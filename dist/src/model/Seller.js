'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongoosePaginate = require('mongoose-paginate');

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.set('sellerCreateIndex', true);
var sellerSchema = _mongoose2.default.Schema({
  code: {
    type: String,
    index: true
  },
  email: {
    type: String,
    index: true,
    unique: true
  },
  identificationCard: {
    type: String,
    index: true,
    unique: true
  },
  name: String,
  lastName: String,
  phone: String,
  salt: String,
  password: String,
  temporalPassword: {
    type: Number,
    required: true,
    default: 0,
    min: 0, // no temporal
    max: 1 // temporal
  },
  deleted: {
    type: Number,
    required: true,
    default: 0,
    min: 0, // no eliminado
    max: 1 // eliminado
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: { type: Date, default: Date.now }
});
sellerSchema.plugin(_mongoosePaginate2.default);

var Seller = _mongoose2.default.model('Seller', sellerSchema);

// se exporta el nuevo modelo
exports.default = Seller;