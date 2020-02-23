'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _sellers = require('src/lib/sellers');

var _sellers2 = _interopRequireDefault(_sellers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sellers = new _sellers2.default();

// se crea el nuevo router para almacenar rutas
var router = _express2.default.Router();

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', function (req, res) {
  // if (req.seller.role != 'admin') return res.status(401).send('Unauthorized')
  // se obtienen los parametros del request
  var query = req.query;

  // se obtiene los usuarios de la base de datos
  sellers.getSellers(query).then(function (response) {
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
  sellers.getSellers(id).then(function (response) {
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

  sellers.updateSeller(id, params).then(function (response) {
    res.json({
      seller: response.seller
    });
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
    code: req.body.code ? _g.validator.escape(_g.validator.trim(req.body.code)) : null,
    email: req.body.email ? _g.validator.escape(_g.validator.trim(req.body.email)) : null,
    identificationCard: req.body.identificationCard ? _g.validator.escape(_g.validator.trim(req.body.identificationCard)) : null,
    name: req.body.name ? _g.validator.escape(_g.validator.trim(req.body.name)) : null,
    lastName: req.body.lastName ? _g.validator.escape(_g.validator.trim(req.body.lastName)) : null,
    phone: req.body.phone ? _g.validator.escape(_g.validator.trim(req.body.phone)) : null
  };
  var areFieldsRight = body.code && body.email && body.identificationCard && body.name && body.lastName && body.phone;

  // validamos los fields requeridos
  if (areFieldsRight) {
    companies.addSellerByEmail(body).then(function (response) {
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

// se exporta el nuevo router
exports.default = router;