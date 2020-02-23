import express from 'express'
import User from 'src/lib/user'
import unirest from 'unirest'

const users = new User()

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/restaurants', (req, res) => {
  // if (req.user.role != 'admin') return res.status(401).send('Unauthorized')
    // se obtienen los parametros del request
  const query = req.query

  const body = {
    latitude: req.query.lat ? _g.validator.escape(_g.validator.trim(req.query.lat)) : null,
    longitude: req.query.lng ? _g.validator.escape(_g.validator.trim(req.query.lng)) : null,
    limit: _g.rapidApi.constants.LIMIT,
    currency: _g.rapidApi.constants.CURRENCY,
    distance: _g.rapidApi.constants.DISTANCE,
    lunit: _g.rapidApi.constants.LUNIT,
    lang: _g.rapidApi.constants.LANG
  }
  let areFieldsRight = body.latitude && body.longitude

  if (areFieldsRight) {
    unirest
    .get(`${_g.rapidApi.constants.API_URL}/restaurants/list-by-latlng`)
    .query(body)
    .headers(_g.rapidApi.headers)
    .end((unires) => {
    	if (unires.error) {
        res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
          success: false,
          error: uniRes.error
        })
      } else {
        res.json(unires.body)
      }
    })
  } else {
    res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({ error: _g.constants.RESPONSES.MISSING_FIELDS_OR_WRONG_INPUTS })
  }

})

// se exporta el nuevo router
export default router
