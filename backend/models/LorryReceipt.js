const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LorryReceipt = new Schema(
  {
    isBlank: {
      type: Boolean,
      default: false,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    lrNo: {
      type: Number,
      required: true,
      unique: true,
    },
    wayBillNo: {
      type: String,
    },
    date: {
      type: String,
    },
    vehicleNo: {
      type: String,
      required: function () {
        return !this.isBlank;
      },
    },
    vehicleType: {
      type: String,
      required: function () {
        return !this.isBlank;
      },
    },
    consignor: {
      type: String,
      required: function () {
        return !this.isBlank;
      },
    },
    from: {
      type: String,
      required: function () {
        return !this.isBlank;
      },
    },
    to: {
      type: String,
      required: function () {
        return !this.isBlank;
      },
    },
    consignee: {
      type: String,
      required: function () {
        return !this.isBlank;
      },
    },
    deliveryAt: {
      type: String,
    },
    payType: {
      type: String,
    },
    remark: {
      type: String,
    },
    status: {
      type: Number,
      default: 0,
      /*0 = new, 1 = loading slip generated, 2 = unloaded, 3 = delivered, 4 = closed*/
    },
    transactions: [
      {
        invoiceNo: {
          type: String,
          required: true,
        },
        boxQuantity: {
          type: Number,
          required: true,
        },
        popQuantity: {
          type: Number,
          required: true,
        },
        looseQuantity: {
          type: Number,
          required: true,
        }, // looseOuterQuantity
        loosePiece: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    paymentAdvice: [
      {
        description: {
          type: String,
        },
        amount: {
          type: Number,
          required: true,
        },
        addedOn: {
          type: String,
          required: true,
        },
      },
    ],
    paymentReceiptGenerated: {
      type: Boolean,
      default: false,
    },
    associatedPR: {
      type: String,
    },
    unloadTo: {
      type: String,
      default: "",
    },
    unloadDate: {
      type: String,
      default: null,
    },
    unloadBranch: {
      type: String,
      default: "",
    },
    deliveryDate: {
      type: String,
      default: null,
    },
    close: {
      type: Boolean,
      default: false,
    },
    closeReason: {
      type: String,
      default: "",
    },
    associatedLS: {
      type: String,
      default: "",
    },
    billGenerated: {
      type: Boolean,
      default: false,
    },
    assoBill: {
      type: String,
      default: "",
    },
    serviceType: {
      type: String,
    },
    ack: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    yesNo: {
      type: String,
      default: "no",
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
    collection: "lorryReceipt",
    timestamps: true,
  }
);

LorryReceipt.index({ vehicleNo: "text" });

module.exports = mongoose.model("LorryReceipt", LorryReceipt);

// to increment the LR no.
// check https://www.npmjs.com/package/mongoose-auto-increment
