'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _transaction = require('src/lib/transaction');

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transactions = new _transaction2.default();

// se crea el nuevo router para almacenar rutas
var router = _express2.default.Router();

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', function (req, res) {
	// se obtienen los parametros del request
	var query = req.query;

	// se obtiene los usuarios de la base de datos
	transactions.getTransactions(query).then(function (response) {
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
	transactions.getTransactions(id).then(function (response) {
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