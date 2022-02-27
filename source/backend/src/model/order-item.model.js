const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
});

orderItemSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

orderItemSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
