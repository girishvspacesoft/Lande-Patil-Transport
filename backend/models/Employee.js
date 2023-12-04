const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Employee = new Schema({
  name: {
    type: String,
    required: true,
    index: true
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
  mobile: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    index: true
  },
  joiningDate: {
    type: String
  },
  qualification: {
    type: String
  },
  bloodGroup: {
    type: String
  },
  designation: {
    type: String,
    index: true
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
  collection: 'employee',
  timestamps: true
});

Employee.index({ name: 'text', mobile: 'text', email: 'text', designation: 'text' });

module.exports = mongoose.model('Employee', Employee);
