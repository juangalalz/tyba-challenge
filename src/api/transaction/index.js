import express from 'express'
import Transaction from 'src/lib/transaction'

const transactions = new Transaction()

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
    // se obtienen los parametros del request
  let query = req.query

  // se obtiene los usuarios de la base de datos
  	transactions.getTransactions(query).then((response) => {
		res.json(response)
	}).catch((e) => {
		res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
			success: false,
			error: e
		})
	})
})

/*
 * Este endpoint devuelve un registro especifico
 */
router.get('/:id', (req, res) => {
  let id = { _id: req.params.id }
  transactions.getTransactions(id).then((response) => {
		res.json(response)
	}).catch((e) => {
		res.status(_g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN).send({
			success: false,
			error: e
		})
	})
})

// se exporta el nuevo router
export default router
