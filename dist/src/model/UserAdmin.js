'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongoosePaginate = require('mongoose-paginate');

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.set('userAdminCreateIndex', true);
var userAdminSchema = _mongoose2.default.Schema({
  email: {
    type: String,
    index: true,
    unique: true
  },
  name: String,
  lastName: String,
  salt: String,
  password: String,
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
userAdminSchema.plugin(_mongoosePaginate2.default);

var UserAdmin = _mongoose2.default.model('UserAdmin', userAdminSchema);

// se exporta el nuevo modelo
exports.default = UserAdmin;