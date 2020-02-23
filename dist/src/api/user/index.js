'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('src/lib/user');

var _user2 = _interopRequireDefault(_user);

var _unirest = require('unirest');

var _unirest2 = _interopRequireDefault(_unirest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var users = new _user2.default();

// se crea el nuevo router para almacenar rutas
var router = _express2.default.Router();

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/restaurants', function (req, res) {
  // if (req.user.role != 'admin') return res.status(401).send('Unauthorized')
  // se obtienen los parametros del request
  var query = req.query;

  var body = {
    latitude: req.query.lat ? _g.validator.escape(_g.validator.trim(req.query.lat)) : null,
    longitude: req.query.lng ? _g.validator.escape(_g.validator.trim(req.query.lng)) : null,
    limit: _g.rapidApi.constants.LIMIT,
    currency: _g.rapidApi.constants.CURRENCY,
    distance: _g.rapidApi.constants.DISTANCE,
    lunit: _g.rapidApi.constants.LUNIT,
    lang: _g.rapidApi.constants.LANG
  };
  var areFieldsRight = body.latitude && body.longitude;

  if (areFieldsRight) {
    _unirest2.default.get(_g.rapidApi.constants.API_URL + '/restaurants/list-by-latlng').query(body).headers(_g.rapidApi.headers).end(function (unires) {
      if (unires.error) {
        res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
          success: false,
          error: uniRes.error
        });
      } else {
        res.json(unires.body);
      }
    });
  } else {
    res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({ error: _g.constants.RESPONSES.MISSING_FIELDS_OR_WRONG_INPUTS });
  }
});

// se exporta el nuevo router
exports.default = router;