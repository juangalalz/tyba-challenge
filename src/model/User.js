import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

let userSchema = mongoose.Schema({
  email: {
    type: String,
    index: true,
    unique: true
  },
  name: String,
  lastName: String,
  salt: String,
  password: String,
  deleted: {
    type: Number,
    required: true,
    default: 0,
    min: 0, // no eliminado
    max: 1 // eliminado
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: { type: Date, default: Date.now }
});
userSchema.plugin(mongoosePaginate)

let User = mongoose.model('User', userSchema);

// se exporta el nuevo modelo
export default User
