'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _ref = require('src/lib/ref');

var _ref2 = _interopRequireDefault(_ref);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var refs = new _ref2.default();

// se crea el nuevo router para almacenar rutas
var router = _express2.default.Router();

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', function (req, res) {
  // if (req.ref.role != 'admin') return res.status(401).send('Unauthorized')
  // se obtienen los parametros del request
  var query = req.query;

  // se obtiene los usuarios de la base de datos
  refs.getRefs(query).then(function (response) {
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
  refs.getRefs(id).then(function (response) {
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

  refs.updateRef(id, params).then(function (response) {
    res.json({
      ref: response.ref
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
    idRef: req.body.idRef ? _g.validator.escape(_g.validator.trim(req.body.idRef)) : null,
    reference: req.body.reference ? _g.validator.escape(_g.validator.trim(req.body.reference)) : null
  };
  var areFieldsRight = body.idRef && body.reference;

  // validamos los fields requeridos
  if (areFieldsRight) {
    refs.addRef(body).then(function (response) {
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
  refs.updateRef(id, params).then(function (response) {
    res.json({
      ref: response.ref
    });
  }).catch(function (e) {
    res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
      success: false,
      error: e
    });
  });
});

/*
 * Este endpoint crea bulk nuevo registro
 */
router.post('/bulk', function (req, res) {
  refs.createBulk().then(function (response) {
    res.json(response);
  }).catch(function (e) {
    res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
      success: false,
      error: e
    });
  });
});

// se exporta el nuevo router
exports.default = router;