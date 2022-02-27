const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    collection: 'categories',
    timestamps: true,
  },
);

categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

categorySchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Category', categorySchema);
