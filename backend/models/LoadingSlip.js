const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoadingSlip = new Schema({
  branch: {
    type: String,
    required: true
  },
  lsNo: {
    type: Number,
    unique: true
  },
  date: {
    type: String,
    required: true
  },
  vehicleNo: {
    type: String,
    required: true
  },
  vehicleOwner: {
    type: String,
    required: true
  },
  vehicleOwnerAddress: {
    type: String,
    required: true
  },
  driverName: {
    type: String,
    required: true
  },
  licenseNo: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  lrList: [{
    lrNo: String
  }],
  toPay: {
    type: Number,
    required: true
  },
  billed: {
    type: Number,
    required: true
  },
  hire: {
    type: Number,
    required: true
  },
  advance: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    required: true
  },
  hamali: {
    type: Number,
    required: true
  },
  stacking: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  ackBranch: {
    type: String,
    required: true
  },
  remark: {
    type: String
  },
  status: {
    type: Number,
    default: 0
    /*0 = un-assigned, 1 = assigned*/
  },
  isLocalMemo: {
    type: Boolean,
    default: false
  },
  supplierPayments: [
    {
      date: {
        type: String,
        required: true
      },
      paid: {
        type: Number,
        required: true
      },
      createdBy: {
        type: String,
        require: true
      }
    }
  ],
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
  collection: 'loadingSlip',
  timestamps: true
});

LoadingSlip.index({ vehicleNo: 'text' });

module.exports = mongoose.model('LoadingSlip', LoadingSlip);

// to increment the LR no.
// check https://www.npmjs.com/package/mongoose-auto-increment