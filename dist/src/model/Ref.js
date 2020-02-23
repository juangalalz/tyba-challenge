'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongoosePaginate = require('mongoose-paginate');

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.set('refCreateIndex', true);
var refSchema = _mongoose2.default.Schema({
  idRef: {
    type: String,
    index: true
  },
  reference: {
    type: String,
    index: true,
    unique: true
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
refSchema.plugin(_mongoosePaginate2.default);

var Ref = _mongoose2.default.model('Ref', refSchema);

// se exporta el nuevo modelo
exports.default = Ref;