const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentReceipt = new Schema(
  {
    prNo: {
      type: Number,
      unique: true,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    diesel: {
      type: Number,
      default: 0,
      required: true,
    },
    cash: {
      type: Number,
      default: 0,
      required: true,
    },
    hamali: {
      type: Number,
      default: 0,
      required: true,
    },
    tollCharges: {
      type: Number,
      default: 0,
      required: true,
    },
    containmentCharges: {
      type: Number,
      default: 0,
      required: true,
    },
    autoCharges: {
      type: Number,
      default: 0,
      required: true,
    },
    otherCharges: {
      type: Number,
      default: 0,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    lrList: [
      {
        type: String,
      },
    ],
    remark: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: function () {
        return !this.updatedBy;
      },
    },
    updatedBy: {
      type: String,
      required: function () {
        return !this.createdBy;
      },
    },
  },
  {
    collection: "paymentReceipt",
    timestamps: true,
  }
);

module.exports = mongoose.model("PaymentReceipt", PaymentReceipt);

// to increment the LR no.
// check https://www.npmjs.com/package/mongoose-auto-increment
