'use strict';

var _headers;

var _database = require('src/config/database');

var _database2 = _interopRequireDefault(_database);

var _constants = require('src/common/constants');

var _rapidApi = require('src/common/rapidApi');

var _utilities = require('src/common/utilities');

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// componente donde se indican los componentes / vars globales para la app
global._g = {
	configDatabase: _database2.default,
	constants: {
		RESPONSES: _constants.RESPONSES,
		ERROR_CODES: _constants.ERROR_CODES
	},
	utils: {
		shaEncrypt: _utilities.shaEncryp
	},
	validator: _validator2.default,
	rapidApi: {
		headers: (_headers = {}, _defineProperty(_headers, _rapidApi.RAPID_HEADER.RAPIDAPI_HOST_NAME, _rapidApi.RAPID_HEADER.API_HOST), _defineProperty(_headers, _rapidApi.RAPID_HEADER.RAPIDAPI_KEY_NAME, _rapidApi.RAPID_HEADER.API_KEY), _headers),
		constants: _rapidApi.RAPID_CONSTANTS
	}
};