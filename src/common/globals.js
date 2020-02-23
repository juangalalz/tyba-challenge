import configDatabase from 'src/config/database'
import {RESPONSES, ERROR_CODES} from 'src/common/constants'
import {RAPID_HEADER, RAPID_CONSTANTS} from 'src/common/rapidApi'
import {shaEncryp} from 'src/common/utilities'
import validator from 'validator'


// componente donde se indican los componentes / vars globales para la app
global._g = {
	configDatabase: configDatabase,
	constants: {
		RESPONSES: RESPONSES,
		ERROR_CODES: ERROR_CODES
	},
	utils: {
		shaEncrypt: shaEncryp
	},
	validator: validator,
  rapidApi: {
    headers: {
      [RAPID_HEADER.RAPIDAPI_HOST_NAME]: RAPID_HEADER.API_HOST,
      [RAPID_HEADER.RAPIDAPI_KEY_NAME]: RAPID_HEADER.API_KEY
    },
    constants: RAPID_CONSTANTS
  }
}
