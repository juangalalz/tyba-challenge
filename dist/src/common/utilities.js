'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shaEncryp = shaEncryp;
exports.randomString = randomString;

var _jsSha = require('js-sha512');

var _jsSha2 = _interopRequireDefault(_jsSha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Esta función permite encriptar en sha512
 */
function shaEncryp(msg) {
  // se encripta el mensaje
  var hash = (0, _jsSha2.default)(msg);
  // se convierte a hexadecimal y se retorna
  return hash.toString('hex');
} /**
  * Utilidades de la aplicación
  */


var alphabetLowercase = 'abcdefghijklmnopqrstuvwxyz';
var alphabetUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var numbers = '0123456789';
var symbols = '~`!@#$%^&*()_+-={}[]:"\'<>?,./|\\';

// función responsable de obtener un string alphanumeric ramdom de [length] caracteres
function randomString(length, chars) {
  var result = '';
  var mask = '';

  if (chars.indexOf('a') > -1) mask += alphabetLowercase;
  if (chars.indexOf('A') > -1) mask += alphabetUppercase;
  if (chars.indexOf('#') > -1) mask += numbers;
  if (chars.indexOf('!') > -1) mask += symbols;
  if (chars.indexOf('#aA') > -1) mask += alphabetLowercase + alphabetUppercase + numbers;

  for (var i = length; i > 0; --i) {
    result += mask[Math.floor(Math.random() * mask.length)];
  }

  return result;
}