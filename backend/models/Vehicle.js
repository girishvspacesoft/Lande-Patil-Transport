const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vehicle = new Schema({
  owner: {
    type: String
  },
  vehicleType: {
    type: String,
    required: true
  },
  vehicleNo: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: String
  },
  make: {
    type: String
  },
  description: {
    type: String
  },
  regDate: {
    type: String
  },
  expDate: {
    type: String
  },
  engineNo: {
    type: String
  },
  chassisNo: {
    type: String
  },
  pucNo: {
    type: String
  },
  pucExpDate: {
    type: String
  },
  body: {
    type: String
  },
  taxDetails: [
    {
      taxType: {
        type: String,
        required: true
      },
      amount: {
        type: String,
        required: true
      },
      startDate: {
        type: String
      },
      endDate: {
        type: String
      },
      description: {
        type: String
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
  collection: 'vehicle',
  timestamps: true
})

module.exports = mongoose.model('Vehicle', Vehicle);
