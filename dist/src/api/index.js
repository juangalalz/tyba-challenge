'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('src/api/user');

var _user2 = _interopRequireDefault(_user);

var _transaction = require('src/api/transaction');

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// se crea el nuevo router para almacenar rutas
var router = _express2.default.Router();

// se valida que el usuario esté loguaedo, si no se responde con 401
// router.use((req, res, next) => {
//   if (req.user) {
//     console.log('req.user', req.user)
//   } else {
//     console.log('req.user', null)
//   }
//   next()
// })

router.use('/users', _user2.default);
router.use('/transactions', _transaction2.default);

// se exporta el nuevo router
exports.default = router;