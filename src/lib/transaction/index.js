import TransactionModel from 'src/model/Transaction'
import { Types, mongoose } from 'mongoose'

class Transaction {

	getTransactions(params) {
		let page = params.page || 1
		delete params.page
		let limit = 20

		if(params.search){
			params.$or = [
        {
          method: {
            $regex: ".*"+params.search+".*",
            $options: 'i'
          }
        },
        {
          email: {
            $regex: ".*"+params.search+".*",
            $options: 'i'
          }
        },
        {
          uri: {
            $regex: ".*"+params.search+".*",
            $options: 'i'
          }
        },
			]
			if(Types.ObjectId.isValid(params.search)) {
				params.$or.push({
					_id: params.search
				})
			}
			delete params.search
		}

		return TransactionModel.paginate(params, { page: page, limit: limit, sort: { 'createdAt': -1 }})
		.then(response => {
			return Promise.resolve(response)
		})
		.catch((e) => {
			return Promise.reject(e)
		})
	}

	addTransaction(req, user) {
    const url = req._parsedUrl

  	let newTransaction = new TransactionModel()
  	newTransaction.method = req.method
    newTransaction.uri = url.pathname
  	newTransaction.headers = JSON.stringify(req.headers)
  	newTransaction.body = JSON.stringify(req.body)
  	newTransaction.query = url.query ? url.query : ''

    if (user) {
      newTransaction.user = new Types.ObjectId(user._id)
      newTransaction.email = user.email
    }

    newTransaction.save()

	}

}

export default Transaction
