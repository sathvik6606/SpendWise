import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    reminder: {
      type: Boolean,
      default: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: 'Utilities',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model('Bill', billSchema);
export default Bill;
