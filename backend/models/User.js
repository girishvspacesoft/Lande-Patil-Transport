const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  branch: {
    type: String,
    required: function () { return this.type.toLowerCase() !== 'superadmin' }
  },
  type: {
    type: String, //['Admin', 'User']
    required: true
  },
  employee: {
    type: String,
    required: function () { return this.type.toLowerCase() !== 'superadmin' },
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  permissions: {
    master: {
      articles: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      places: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      branches: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      customers: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      employees: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      drivers: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      vehicles: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      vehicleTypes: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      vehicleOwners: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      suppliers: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      banks: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      bankAccounts: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      }
    },
    transactions: {
      lr: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      dc: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      fm: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      ir: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      pod: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      }
    },
    bills: {
      regular: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      transporter: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      }
    },
    reports: {
      mis: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      transporter: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      stock: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      lrByDate: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      lrByBranch: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      lrByCustomer: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      dcByDate: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      dcByBranch: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      dcByVehicle: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      collectionFm: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      lineFm: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      customerEndFm: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      transporterBillReport: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      },
      transporter: {
        read: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        },
        write: {
          type: Boolean,
          default: function () { return this.type.toLowerCase() === 'superadmin' }
        }
      }
    }
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
  collection: 'users',
  timestamps: true
});

User.index({ employee: 'text', username: 'text' });

module.exports = mongoose.model('User', User);
