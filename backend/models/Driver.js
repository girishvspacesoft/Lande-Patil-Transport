const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Driver = new Schema({
  name: {
    type: String,
    required: true
  },
  correspondenceAddress: {
    type: String
  },
  permanentAddress: {
    type: String
  },
  dateOfBirth: {
    type: String
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  fatherName: {
    type: String
  },
  referencedBy: {
    type: String
  },
  eyeSight: {
    type: String
  },
  licenseNo: {
    type: String,
    required: true,
    unique: true
  },
  licenseType: {
    type: String
  },
  qualification: {
    type: String
  },
  joiningDate: {
    type: String
  },
  bloodGroup: {
    type: String
  },
  renewDate: {
    type: String
  },
  expiryDate: {
    type: String
  },
  remark: {
    type: String
  },
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
  collection: 'driver',
  timestamps: true
})

module.exports = mongoose.model('Driver', Driver);
