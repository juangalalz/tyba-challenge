'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _color = require('src/lib/color');

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var colors = new _color2.default();

// se crea el nuevo router para almacenar rutas
var router = _express2.default.Router();

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', function (req, res) {
  // if (req.color.role != 'admin') return res.status(401).send('Unauthorized')
  // se obtienen los parametros del request
  var query = req.query;

  // se obtiene los usuarios de la base de datos
  colors.getColors(query).then(function (response) {
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
  colors.getColors(id).then(function (response) {
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

  colors.updateColor(id, params).then(function (response) {
    res.json({
      color: response.color
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
    name: req.body.name ? _g.validator.escape(_g.validator.trim(req.body.name)) : null,
    color: req.body.color ? _g.validator.escape(_g.validator.trim(req.body.color)) : null,
    refId: req.body.refId ? _g.validator.escape(_g.validator.trim(req.body.refId)) : null,
    refName: req.body.refName ? _g.validator.escape(_g.validator.trim(req.body.refName)) : null,
    status: req.body.status ? _g.validator.escape(_g.validator.trim(req.body.status)) : null
  };
  var areFieldsRight = body.name && body.refId && body.refName && body.status;

  // validamos los fields requeridos
  if (areFieldsRight) {
    colors.addColor(body).then(function (response) {
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
  colors.updateColor(id, params).then(function (response) {
    res.json({
      color: response.color
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
  colors.createBulk().then(function (response) {
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