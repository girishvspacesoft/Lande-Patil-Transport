const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bill = new Schema({
  branch: {
    type: String,
    required: true
  },
  billNo: {
    type: Number,
    unique: true
  },
  date: {
    type: String,
    required: true
  },
  customer: {
    type: String,
    required: true
  },
  lrList: [{
    lrNo: String
  }],
  totalAmount: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: String,
    required: true
  },
  serviceTax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  remark: {
    type: String
  },
  paymentCollection: [{
    receivingDate: {
      type: String,
      required: true
    },
    receive: {
      type: Number,
      required: true
    },
    tds: {
      type: Number,
      default: 0
    },
    extra: {
      type: Number,
      default: 0
    },
    reverse: {
      type: Number,
      default: 0
    },
    reverseReason: {
      type: String
    },
    payMode: {
      type: String,
      required: true
    },
    bankName: {
      type: String
    },
    chequeNo: {
      type: String
    },
    chequeDate: {
      type: String
    },
    createdBy: {
      type: String,
      required: true
    }
  }],
  active: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: function () { return !this.updatedBy }
  },
  updatedBy: {
    type: String,
    required: function () { return !this.createdBy }
  }
}, {
  collection: 'bill',
  timestamps: true
});

module.exports = mongoose.model('Bill', Bill);