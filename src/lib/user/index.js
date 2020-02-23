import UserModel from 'src/model/User'
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid'
import { Types, mongoose } from 'mongoose'

class User {


	constructor() {
	}

	getUsers(params) {
		let page = params.page || 1
		delete params.page
		let limit = 20

		if(params.search){
			params.$or = [
        {
          email: {
            $regex: ".*"+params.search+".*",
            $options: 'i'
          }
        },
				{
					name: {
						$regex: ".*"+params.search+".*",
						$options: 'i'
					}
				},
				{
					lastName: {
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

    params['deleted'] = 0

		return UserModel.paginate(params, { page: page, limit: limit, sort: { 'createdAt': -1 }})
		.then(response => {
			return Promise.resolve(response)
		})
		.catch((e) => {
			return Promise.reject(e)
		})
	}

	addUserByEmail(userData) {
		return UserModel.findOne({ email: userData.email }).exec()
		.then((user) => {
			if (user) {
			// el usuario ya existe no se puede registrar de nuevo
				return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.FORBIDDEN })
			} else {
				let newUser = new UserModel()

        newUser.email = userData['email']
				newUser.name = userData['name']
				newUser.lastName = userData['lastName']
        newUser.salt = uniqid()
        newUser.password = _g.utils.shaEncrypt(newUser.salt + userData.password)

				return newUser.save()
			}
		}).then((newUser) => {
			delete newUser.password
			delete newUser.salt
			// registrado!, se crea el token
			var token = jwt.sign(newUser.toJSON(), _g.configDatabase.secret)

			return Promise.resolve({newUser, token})
		}).catch((e) => {
			console.log("e", e)
			return Promise.reject(e)
		})
	}

	updateUser(id, newData) {
		if (newData['password'] != null) {
			newData['salt'] = uniqid()
	  	newData['password'] = _g.utils.shaEncrypt(newData['salt'] + newData['password'])
		}
    // if (newData.companyId) {
    //   newData.company = new Types.ObjectId(newData.companyId)
    // }

		return UserModel.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }).exec()
		.then((user) => {
			// se encontró el usuario
			if (user) {
				delete user.password
				delete user.salt
				return Promise.resolve({ user: user })
			} else {
				return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.NOT_FOUND })
			}
		})
		.catch((e) => {
			return Promise.reject(e)
		})
	}

}

export default User
