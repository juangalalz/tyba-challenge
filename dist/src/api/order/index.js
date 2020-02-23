'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _order = require('src/lib/order');

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var orders = new _order2.default();

// se crea el nuevo router para almacenar rutas
var router = _express2.default.Router();

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', function (req, res) {
  // if (req.order.role != 'admin') return res.status(401).send('Unauthorized')
  // se obtienen los parametros del request
  var query = req.query;

  // se obtiene los usuarios de la base de datos
  orders.getOrders(query).then(function (response) {
    res.json(response);
  }).catch(function (e) {
    res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
      success: false,
      error: e
    });
  });
});

/*
 * Este endpoint devuelve un registro especifico
 */
router.get('/:id', function (req, res) {
  var id = { _id: req.params.id };
  orders.getOrders(id).then(function (response) {
    res.json(response);
  }).catch(function (e) {
    res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
      success: false,
      error: e
    });
  });
});
/*
 * Este endpoint devuelve un registro especifico
 */
router.get('/:id/products', function (req, res) {
  var query = req.query;
  orders.getOrderProducts(req.params.id, query).then(function (response) {
    res.json(response);
  }).catch(function (e) {
    res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
      success: false,
      error: e
    });
  });
});

/*
 * Este endpoint actualiza un registro especifico
 */
router.put('/:id', function (req, res) {
  var params = req.body;
  var id = req.params.id;

  orders.updateOrder(id, params).then(function (response) {
    res.json({
      order: response.order
    });
  }).catch(function (e) {
    res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
      success: false,
      error: e
    });
  });
});

/*
 * Este endpoint actualiza un registro especifico
 */
router.put('/:id/products', function (req, res) {
  var params = req.body;
  var id = req.params.id;

  orders.addProductsToOrder(id, params).then(function (response) {
    res.json(response);
  }).catch(function (e) {
    res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
      success: false,
      error: e
    });
  });
});

/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', function (req, res) {
  // Esto se debe cambiar despues para un usuario con token
  var body = {
    businessName: req.body.businessName ? _g.validator.escape(_g.validator.trim(req.body.businessName)) : null,
    nit: req.body.nit ? _g.validator.escape(_g.validator.trim(req.body.nit)) : null,
    billingAddress: req.body.billingAddress ? _g.validator.escape(_g.validator.trim(req.body.billingAddress)) : null,
    city: req.body.city ? _g.validator.escape(_g.validator.trim(req.body.city)) : null,
    phone: req.body.phone ? _g.validator.escape(_g.validator.trim(req.body.phone)) : null,
    email: req.body.email ? _g.validator.escape(_g.validator.trim(req.body.email)) : null,
    shippingAddress: req.body.shippingAddress ? _g.validator.escape(_g.validator.trim(req.body.shippingAddress)) : null,
    shippingCity: req.body.shippingCity ? _g.validator.escape(_g.validator.trim(req.body.shippingCity)) : null,
    clientId: req.body.clientId ? _g.validator.escape(_g.validator.trim(req.body.clientId)) : null,
    clientCode: req.body.clientCode ? _g.validator.escape(_g.validator.trim(req.body.clientCode)) : null,
    sellerId: req.body.sellerId ? _g.validator.escape(_g.validator.trim(req.body.sellerId)) : null,
    sellerName: req.body.sellerName ? _g.validator.escape(_g.validator.trim(req.body.sellerName)) : null,
    sellerEmail: req.body.sellerEmail ? _g.validator.escape(_g.validator.trim(req.body.sellerEmail)) : null
  };
  var areFieldsRight = body.businessName && body.nit && body.clientId;

  // validamos los fields requeridos
  if (areFieldsRight) {
    orders.addOrderByEmail(body).then(function (response) {
      res.json({
        response: response
      });
    }).catch(function (e) {
      res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
        success: false,
        error: e
      });
    });
  } else {
    res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({ error: _g.constants.RESPONSES.MISSING_FIELDS_OR_WRONG_INPUTS });
  }
});

/*
 * Este endpoint eliina un registro especifico
 */
router.post('/:id/delete', function (req, res) {
  var params = { deleted: 1 };
  var id = req.params.id;
  orders.updateOrder(id, params).then(function (response) {
    res.json({
      order: response.order
    });
  }).catch(function (e) {
    res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
      success: false,
      error: e
    });
  });
});

// se exporta el nuevo router
exports.default = router;