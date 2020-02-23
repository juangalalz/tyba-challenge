'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongoosePaginate = require('mongoose-paginate');

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.set('colorCreateIndex', true);
var colorSchema = _mongoose2.default.Schema({
  name: String,
  color: String,
  refName: String,
  ref: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Ref'
  },
  status: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
    max: 1
  }, // 0 => Desactivado, 1 => Activo
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
colorSchema.plugin(_mongoosePaginate2.default);

var Color = _mongoose2.default.model('Color', colorSchema);

// se exporta el nuevo modelo
exports.default = Color;