import express from 'express'

import user from 'src/api/user'
import transaction from 'src/api/transaction'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

// se valida que el usuario esté loguaedo, si no se responde con 401
// router.use((req, res, next) => {
//   if (req.user) {
//     console.log('req.user', req.user)
//   } else {
//     console.log('req.user', null)
//   }
//   next()
// })

router.use('/users', user)
router.use('/transactions', transaction)

// se exporta el nuevo router
export default router
