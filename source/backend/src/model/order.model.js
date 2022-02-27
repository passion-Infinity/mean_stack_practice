const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderItems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
        require: true,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    shippingAddress1: {
      type: String,
      require: true,
    },
    shippingAddress2: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    zip: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      default: 'Pending',
      require: true,
    },
    totalPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: 'orders',
  },
);

orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

orderSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Order', orderSchema);
