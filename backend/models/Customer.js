const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer = new Schema({
  branch: {
    type: String
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  phone: {
    type: String,
    index: true
  },
  fax: {
    type: String,
    index: true
  },
  cstNo: {
    type: String
  },
  gstNo: {
    type: String
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  email: {
    type: String,
    index: true
  },
  vendorCode: {
    type: String
  },
  vatNo: {
    type: String
  },
  eccNo: {
    type: String
  },
  openingBalance: {
    type: String
  },
  openingBalanceType: {
    type: String
  },
  closingBalance: {
    type: String
  },
  closingBalanceType: {
    type: String
  },
  contactPerson: [
    {
      name: {
        type: String
      },
      address: {
        type: String
      },
      designation: {
        type: String
      },
      email: {
        type: String
      },
      mobile: {
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
  collection: 'customer',
  timestamps: true
});

Customer.index({ name: 'text', phone: 'text', fax: 'text', email: 'text' });

module.exports = mongoose.model('Customer', Customer);
