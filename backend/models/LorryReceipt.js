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
    consigno: {
      type: String,
      required: true,
      unique: true,
    },
    wayBillNo: {
      type: String,
    },
    toBill: {
      type: String,
      default: 'Consignee'
    },
    driverName: {
      type: String
    },
    type: {
      type: String,
      default: "deliver",
    },
    mobile: {
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
    // payType: {
    //   type: String,
    // },
    remark: {
      type: String,
    },
    status: {
      type: Number,
      default: 0,
      /*0 = new, 1 = loading slip generated, 2 = unloaded, 3 = delivered, 4 = closed*/
    },
    payment: {
      type: Number,
      default: 0,
      required: this.type === 'deliver'
    },
    waiting: {
      isWaiting: {
        type: Boolean,
        default: false
      },
      start: {
        type: String,
        default: "",
        required: this.type === 'deliver' && this.isWaiting
      },
      end: {
        type: String,
        default: "",
        required: this.type === 'deliver' && this.isWaiting
      }
    },
    chargesDetails: {
      hamali: {
        type: Number,
        default: 0,
        required: function () {
          return this.type !== 'return';
        },
      },
      octroi: {
        type: Number,
        default: 0,
        required: function () {
          return this.type !== 'return';
        },
      },
      weight: {
        type: Number,
        default: 0,
        required: function () {
          return this.type !== 'return';
        },
      },
      toll: {
        type: Number,
        default: 0,
        required: function () {
          return this.type !== 'return';
        },
      },
      escort: {
        type: Number,
        default: 0,
        required: function () {
          return this.type !== 'return';
        },
      },
      other: {
        type: Number,
        default: 0,
        required: function () {
          return this.type !== 'return';
        },
      },
    },
    transactions: [
      {
        invoiceNo: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        place: {
          type: String,
          required: true,
        },
        article: {
          type: String,
          required: true,
        },
        remark: {
          type: String,
        },
        articleNum: {
          type: Number,
          required: true,
        },
        weight: {
          type: Number,
          required: true,
          default: 0,
        },
        payment: {
          type: Number,         
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
