import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

let transactionSchema = mongoose.Schema({
  method: String,
  uri: String,
  query: String,
  headers: String,
  body: String,
  email: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
transactionSchema.plugin(mongoosePaginate)

let Transaction = mongoose.model('Transaction', transactionSchema);

// se exporta el nuevo modelo
export default Transaction
