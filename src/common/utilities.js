/**
* Utilidades de la aplicación
*/
import sha512 from 'js-sha512'

/*
 * Esta función permite encriptar en sha512
 */
export function shaEncryp(msg) {
  // se encripta el mensaje
  let hash = sha512(msg)
  // se convierte a hexadecimal y se retorna
  return hash.toString('hex')
}


let alphabetLowercase = 'abcdefghijklmnopqrstuvwxyz'
let alphabetUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
let numbers = '0123456789'
let symbols = '~`!@#$%^&*()_+-={}[]:"\'<>?,./|\\'

// función responsable de obtener un string alphanumeric ramdom de [length] caracteres
export function randomString(length, chars) {
  var result = ''
  var mask = ''

  if (chars.indexOf('a') > -1) mask += alphabetLowercase
  if (chars.indexOf('A') > -1) mask += alphabetUppercase
  if (chars.indexOf('#') > -1) mask += numbers
  if (chars.indexOf('!') > -1) mask += symbols
  if (chars.indexOf('#aA') > -1) mask += alphabetLowercase + alphabetUppercase + numbers

  for (var i = length; i > 0; --i) {
    result += mask[Math.floor(Math.random() * mask.length)]
  }

  return result
}
