const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Branch = require('../models/Branch');
const Place = require('../models/Place');
const Employee = require('../models/Employee');
const Article = require('../models/Article');
const Customer = require('../models/Customer');
const Driver = require('../models/Driver');
const Supplier = require('../models/Supplier');
const VehicleType = require('../models/VehicleType');
const Vehicle = require('../models/Vehicle');
const Bank = require('../models/Bank');
const BankAccount = require('../models/BankAccount');


// Add a branch
const addBranch = (req, res, next) => {
  const branch = new Branch({
    abbreviation: req.body.abbreviation,
    balanceType: req.body.balanceType,
    branchCode: req.body.branchCode,
    description: req.body.description,
    name: req.body.name,
    openingBalance: req.body.openingBalance,
    place: req.body.place,
    createdBy: req.body.createdBy
  });

  Branch.find({
    $or: [
      { name: req.body.name },
      { branchCode: req.body.branchCode }
    ]
  }, (error, foundBranches) => {
    if (error) {
      return next(error);
    }
    if (foundBranches && foundBranches.length > 0) {
      let message = '';
      for (const foundBranch of foundBranches) {
        if (foundBranch.branchCode === req.body.branchCode && foundBranch.name === req.body.name) {
          message = `Branch with Branch code (${foundBranch.branchCode}) and Branch name (${foundBranch.name}) already exist!`;
          break;
        }
        if (foundBranch.branchCode === req.body.branchCode) {
          message = `Branch with Branch code (${foundBranch.branchCode}) already exist!`;
          break;
        }
        if (foundBranch.name === req.body.name) {
          message = `Branch with Branch name (${foundBranch.name}) already exist!`;
          break;
        }
      }
      return res.status(404).json({
        message: message
      });
    }
    Branch.create(branch, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  });
};

// Get all branches (100 branches)
const getBranches = (req, res, next) => {
  Branch
    .find({ active: true })
    .limit(100)
    .exec((error, branches) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching branches!"
        });
      } else {
        res.json(branches);
      }
    });
};

// Get a branch
const getBranch = (req, res, next) => {
  Branch.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

// Remove a branch
const removeBranch = (req, res, next) => {
  if (!req.params.id) {
    return res.status(500).json({ message: 'Branch ID is required!' });
  }

  Branch.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        active: false,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json({ id: data._id });
      }
    });
};

// Update a branch
const updateBranch = (req, res, next) => {
  const _id = req.body._id;

  if (!req.params.id || !_id) {
    return res.status(500).json({ message: 'Branch ID is required!' });
  }

  Branch.findByIdAndUpdate(
    _id,
    {
      $set: {
        branchCode: req.body.branchCode,
        abbreviation: req.body.abbreviation,
        name: req.body.name,
        description: req.body.description,
        place: req.body.place,
        openingBalance: req.body.openingBalance,
        balanceType: req.body.balanceType,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    });
};

// Get places
const getPlaces = (req, res, next) => {
  Place
    .find({ active: true })
    .limit(100)
    .exec((error, places) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching places!"
        });
      } else {
        res.json(places);
      }
    });
};

// Add a Place
const addPlace = (req, res, next) => {
  const place = new Place({
    name: req.body.name,
    abbreviation: req.body.abbreviation,
    createdBy: req.body.createdBy
  });

  Place.find({ name: req.body.name }, (error, foundPlaces) => {
    if (error) {
      return next(error);
    }
    if (foundPlaces && foundPlaces.length > 0) {
      let message = `Place with (${req.body.name} already exist!)`;
      return res.status(404).json({
        message: message
      });
    }
    Place.create(place, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  });
};

// Remove a place
const removePlace = (req, res, next) => {
  if (!req.params.id) {
    return res.status(500).json({ message: 'Place ID is required!' });
  }

  Place.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        active: false,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json({ id: data._id });
      }
    });
};

// Update a place
const updatePlace = (req, res, next) => {
  const _id = req.body._id;

  if (!req.params.id || !_id) {
    return res.status(500).json({ message: 'Place ID is required!' });
  }

  Place.findByIdAndUpdate(
    _id,
    {
      $set: {
        name: req.body.name,
        abbreviation: req.body.abbreviation,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    });
};

// Get a place
const getPlace = (req, res, next) => {
  Place.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

// Add a employee
const addEmployee = (req, res, next) => {
  const employee = new Employee({
    name: req.body.name,
    mobile: req.body.mobile,
    correspondenceAddress: req.body.correspondenceAddress,
    permanentAddress: req.body.permanentAddress,
    dateOfBirth: req.body.dateOfBirth,
    mobile: req.body.mobile,
    email: req.body.email,
    joiningDate: req.body.joiningDate,
    qualification: req.body.qualification,
    bloodGroup: req.body.bloodGroup,
    designation: req.body.designation,
    createdBy: req.body.createdBy
  });

  Employee.find({ mobile: req.body.mobile }, (error, foundEmp) => {
    if (error) {
      return next(error);
    }
    if (foundEmp && foundEmp.length > 0) {
      let message = `Employee with (${req.body.mobile}) already exist!`;
      return res.status(404).json({
        message: message
      });
    }
    Employee.create(employee, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  });
};

// Get 100 employees
const getEmployees = (req, res, next) => {
  Employee
    .find({ active: true })
    .limit(100)
    .exec((error, employees) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching employees!"
        });
      } else {
        res.json(employees);
      }
    });
};

// Remove a employee
const removeEmployee = (req, res, next) => {
  if (!req.params.id) {
    return res.status(500).json({ message: 'Employee ID is required!' });
  }

  Employee.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        active: false,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json({ id: data._id });
      }
    });
};

// Update a employee
const updateEmployee = (req, res, next) => {
  const _id = req.body._id;

  if (!req.params.id || !_id) {
    return res.status(500).json({ message: 'Employee ID is required!' });
  }

  Employee.findByIdAndUpdate(
    _id,
    {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        correspondenceAddress: req.body.correspondenceAddress,
        permanentAddress: req.body.permanentAddress,
        dateOfBirth: req.body.dateOfBirth,
        mobile: req.body.mobile,
        email: req.body.email,
        joiningDate: req.body.joiningDate,
        qualification: req.body.qualification,
        bloodGroup: req.body.bloodGroup,
        designation: req.body.designation,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    });
};

// Get a employee
const getEmployee = (req, res, next) => {
  Employee.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

// Get articles
const getArticles = (req, res, next) => {
  Article
    .find({ active: true })
    .limit(100)
    .exec((error, articles) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching articles!"
        });
      } else {
        res.json(articles);
      }
    });
};

// Get a article
const getArticle = (req, res, next) => {
  Article.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

// Add a article
const addArticle = (req, res, next) => {
  const article = new Article({
    branch: req.body.branch,
    name: req.body.name,
    description: req.body.description,
    createdBy: req.body.createdBy
  });

  Article.find({ name: req.body.name }, (error, foundArticles) => {
    if (error) {
      return next(error);
    }
    if (foundArticles && foundArticles.length > 0) {
      let message = `Articles with (${req.body.name} already exist!)`;
      return res.status(404).json({
        message: message
      });
    }
    Article.create(article, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  });
};

// Remove a article
const removeArticle = (req, res, next) => {
  if (!req.params.id) {
    return res.status(500).json({ message: 'Article ID is required!' });
  }
  Article.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        active: false,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json({ id: data._id });
      }
    });

};

// Update a place
const updateArticle = (req, res, next) => {
  const _id = req.body._id;

  if (!req.params.id || !_id) {
    return res.status(500).json({ message: 'Article ID is required!' });
  }

  Article.findByIdAndUpdate(
    _id,
    {
      $set: {
        branch: req.body.branch,
        name: req.body.name,
        description: req.body.description,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    });
};

// Get customers
const getCustomers = (req, res, next) => {
  Customer
    .find({ active: true })
    .limit(100)
    .exec((error, customers) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching customers!"
        });
      } else {
        res.json(customers);
      }
    });
};

const getCustomersByBranch = (req, res, next) => {
  if (!req.body.branchId) {
    return res.status(401).json({ message: 'Branch ID is required' });
  }

  Customer
    .find({
      branch: req.body.branchId,
      active: true
    })
    .limit(100)
    .exec((error, customers) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching customers!"
        });
      } else {
        res.json(customers);
      }
    });
};

// Get a customer
const getCustomer = (req, res, next) => {
  Customer.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

// Add a customer
const addCustomer = (req, res, next) => {
  const customer = new Customer({
    branch: req.body.branch,
    name: req.body.name,
    type: req.body.type,
    address: req.body.address,
    phone: req.body.phone,
    fax: req.body.fax,
    cstNo: req.body.cstNo,
    gstNo: req.body.gstNo,
    state: req.body.state,
    city: req.body.city,
    email: req.body.email,
    vendorCode: req.body.vendorCode,
    vatNo: req.body.vatNo,
    eccNo: req.body.eccNo,
    openingBalance: req.body.openingBalance,
    openingBalanceType: req.body.openingBalanceType,
    closingBalance: req.body.closingBalance,
    closingBalanceType: req.body.closingBalanceType,
    contactPerson: req.body.contactPerson,
    createdBy: req.body.createdBy
  });

  Customer.find({ name: req.body.name, type: req.body.type, city: req.body.city }, (error, foundCustomer) => {
    if (error) {
      return next(error);
    }
    if (foundCustomer && foundCustomer.length > 0) {
      let message = `Customer with name (${req.body.name}) & type (${req.body.type}) already exist!`;
      return res.status(404).json({
        message: message
      });
    }
    Customer.create(customer, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  });
};

// Update a customer
const updateCustomer = (req, res, next) => {
  const _id = req.body._id;
  if (!req.params.id || !_id) {
    return res.status(500).json({ message: 'Customer ID is required!' });
  }

  Customer.findByIdAndUpdate(
    _id,
    {
      $set: {
        branch: req.body.branch,
        name: req.body.name,
        type: req.body.type,
        address: req.body.address,
        phone: req.body.phone,
        fax: req.body.fax,
        cstNo: req.body.cstNo,
        gstNo: req.body.gstNo,
        state: req.body.state,
        city: req.body.city,
        email: req.body.email,
        vendorCode: req.body.vendorCode,
        vatNo: req.body.vatNo,
        eccNo: req.body.eccNo,
        openingBalance: req.body.openingBalance,
        openingBalanceType: req.body.openingBalanceType,
        closingBalance: req.body.closingBalance,
        closingBalanceType: req.body.closingBalanceType,
        contactPerson: req.body.contactPerson,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    });
};

// Remove a customer
const removeCustomer = (req, res, next) => {
  if (!req.params.id) {
    return res.status(500).json({ message: 'Customer ID is required!' });
  }

  // Customer.findByIdAndUpdate(
  //   req.params.id,
  //   {
  //     $set: {
  //       active: false,
  //       updatedBy: req.body.updatedBy
  //     }
  //   },
  //   { new: true },
  //   (error, data) => {
  //     if (error) {
  //       res.status(500).json({ message: error.message });
  //     } else {
  //       res.json({ id: data._id });
  //     }
  //   });
  Customer.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json({ id: data._id });
    }
  });
};

// Get drivers
const getDrivers = (req, res, next) => {
  Driver
    .find({ active: true })
    .limit(100)
    .exec((error, drivers) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching drivers!"
        });
      } else {
        res.json(drivers);
      }
    });
};

// Get a driver
const getDriver = (req, res, next) => {
  Driver.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

// Add a driver
const addDriver = (req, res, next) => {
  const driver = new Driver({
    name: req.body.name,
    correspondenceAddress: req.body.correspondenceAddress,
    permanentAddress: req.body.permanentAddress,
    dateOfBirth: req.body.dateOfBirth,
    phone: req.body.phone,
    fatherName: req.body.fatherName,
    referencedBy: req.body.referencedBy,
    eyeSight: req.body.eyeSight,
    licenseNo: req.body.licenseNo,
    licenseType: req.body.licenseType,
    qualification: req.body.qualification,
    joiningDate: req.body.joiningDate,
    bloodGroup: req.body.bloodGroup,
    renewDate: req.body.renewDate,
    expiryDate: req.body.expiryDate,
    remark: req.body.remark,
    createdBy: req.body.createdBy
  });

  Driver.find({ phone: req.body.phone }, (error, foundDrivers) => {
    if (error) {
      return next(error);
    }
    if (foundDrivers && foundDrivers.length > 0) {
      let message = `Driver with phone no (${req.body.phone} already exist!)`;
      return res.status(404).json({
        message: message
      });
    }
    Driver.create(driver, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  });
};

// Remove a driver
const removeDriver = (req, res, next) => {
  if (!req.params.id) {
    return res.status(500).json({ message: 'Driver ID is required!' });
  }

  Driver.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        active: false,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json({ id: data._id });
      }
    });
};

// Update a driver
const updateDriver = (req, res, next) => {
  const _id = req.body._id;

  if (!req.params.id || !_id) {
    return res.status(500).json({ message: 'Driver ID is required!' });
  }

  Driver.findByIdAndUpdate(
    _id,
    {
      $set: {
        name: req.body.name,
        correspondenceAddress: req.body.correspondenceAddress,
        permanentAddress: req.body.permanentAddress,
        dateOfBirth: req.body.dateOfBirth,
        phone: req.body.phone,
        fatherName: req.body.fatherName,
        referencedBy: req.body.referencedBy,
        eyeSight: req.body.eyeSight,
        licenseNo: req.body.licenseNo,
        licenseType: req.body.licenseType,
        qualification: req.body.qualification,
        joiningDate: req.body.joiningDate,
        bloodGroup: req.body.bloodGroup,
        renewDate: req.body.renewDate,
        expiryDate: req.body.expiryDate,
        remark: req.body.remark,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    });
};

// Get suppliers
const getSuppliers = (req, res, next) => {
  Supplier
    .find({ active: true })
    .limit(100)
    .exec((error, suppliers) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching suppliers!"
        });
      } else {
        res.json(suppliers);
      }
    });
};

// Get a supplier
const getSupplier = (req, res, next) => {
  Supplier.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

// Add a supplier
const addSupplier = (req, res, next) => {
  const supplier = new Supplier({
    name: req.body.name,
    type: req.body.type,
    address: req.body.address,
    state: req.body.state,
    city: req.body.city,
    phone: req.body.phone,
    email: req.body.email,
    panNo: req.body.panNo,
    vendorCode: req.body.vendorCode,
    vatNo: req.body.vatNo,
    cstNo: req.body.cstNo,
    eccNo: req.body.eccNo,
    openingBalance: req.body.openingBalance,
    openingBalanceType: req.body.openingBalanceType,
    openingBalanceDate: req.body.openingBalanceDate,
    closingBalance: req.body.closingBalance,
    closingBalanceType: req.body.closingBalanceType,
    closingBalanceDate: req.body.closingBalanceDate,
    contactPerson: req.body.contactPerson,
    createdBy: req.body.createdBy
  });

  Supplier.find({ phone: req.body.phone }, (error, foundSupplier) => {
    if (error) {
      return next(error);
    }
    if (foundSupplier && foundSupplier.length > 0) {
      let message = `Supplier with (${req.body.phone}) already exist!`;
      return res.status(404).json({
        message: message
      });
    }
    Supplier.create(supplier, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  });
};

// Update a supplier
const updateSupplier = (req, res, next) => {
  const _id = req.body._id;
  if (!req.params.id || !_id) {
    return res.status(500).json({ message: 'Supplier ID is required!' });
  }

  Supplier.findByIdAndUpdate(
    _id,
    {
      $set: {
        name: req.body.name,
        type: req.body.type,
        address: req.body.address,
        state: req.body.state,
        city: req.body.city,
        phone: req.body.phone,
        email: req.body.email,
        panNo: req.body.panNo,
        vendorCode: req.body.vendorCode,
        vatNo: req.body.vatNo,
        cstNo: req.body.cstNo,
        eccNo: req.body.eccNo,
        openingBalance: req.body.openingBalance,
        openingBalanceType: req.body.openingBalanceType,
        openingBalanceDate: req.body.openingBalanceDate,
        closingBalance: req.body.closingBalance,
        closingBalanceType: req.body.closingBalanceType,
        closingBalanceDate: req.body.closingBalanceDate,
        contactPerson: req.body.contactPerson,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    });
};

// Remove a supplier
const removeSupplier = (req, res, next) => {
  if (!req.params.id) {
    return res.status(500).json({ message: 'Supplier ID is required!' });
  }
  Supplier.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        active: false,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json({ id: data._id });
      }
    });
};

// Get vehicle types
const getVehicleTypes = (req, res, next) => {
  VehicleType
    .find({ active: true })
    .limit(100)
    .exec((error, vehicleTypes) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching vehicle types!"
        });
      } else {
        res.json(vehicleTypes);
      }
    });
};

// Get a vehicle type
const getVehicleType = (req, res, next) => {
  VehicleType.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

// Add a vehicle type
const addVehicleType = (req, res, next) => {
  const vehicleType = new VehicleType({
    type: req.body.type.toUpperCase(),
    tyreQuantity: req.body.tyreQuantity,
    createdBy: req.body.createdBy
  });

  VehicleType.find({ type: req.body.type }, (error, foundType) => {
    if (error) {
      return next(error);
    }
    if (foundType && foundType.length > 0) {
      const message = `Vehicle type with (${req.body.type} already exist!)`;
      return res.status(404).json({
        message: message
      });
    }
    VehicleType.create(vehicleType, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  });
};

// Remove a vehicle type
const removeVehicleType = (req, res, next) => {
  if (!req.params.id) {
    return res.status(500).json({ message: 'Vehicle type ID is required!' });
  }

  // VehicleType.findByIdAndUpdate(
  //   req.params.id,
  //   {
  //     $set: {
  //       active: false,
  //       updatedBy: req.body.updatedBy
  //     }
  //   },
  //   { new: true },
  //   (error, data) => {
  //     if (error) {
  //       res.status(500).json({ message: error.message });
  //     } else {
  //       res.json({ id: data._id });
  //     }
  //   });
  VehicleType.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json({ id: data._id });
    }
  });
};

// Update a vehicle type
const updateVehicleType = (req, res, next) => {
  const _id = req.body._id;

  if (!req.params.id || !_id) {
    return res.status(500).json({ message: 'Vehicle type ID is required!' });
  }

  VehicleType.findByIdAndUpdate(
    _id,
    {
      $set: {
        type: req.body.type.toUpperCase(),
        tyreQuantity: req.body.tyreQuantity,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    });
};

// Get vehicles
const getVehicles = (req, res, next) => {
  Vehicle
    .find({ active: true })
    .limit(100)
    .exec((error, vehicles) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching vehicles!"
        });
      } else {
        res.json(vehicles);
      }
    });
};

// Get a vehicle
const getVehicle = (req, res, next) => {
  Vehicle.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

// Add a vehicle
const addVehicle = (req, res, next) => {
  const vehicle = new Vehicle({
    owner: req.body.owner,
    vehicleType: req.body.vehicleType,
    vehicleNo: req.body.vehicleNo.toUpperCase(),
    capacity: req.body.capacity,
    make: req.body.make,
    description: req.body.description,
    regDate: req.body.regDate,
    expDate: req.body.expDate,
    engineNo: req.body.engineNo,
    chassisNo: req.body.chassisNo,
    pucNo: req.body.pucNo,
    pucExpDate: req.body.pucExpDate,
    body: req.body.body,
    taxDetails: req.body.taxDetails,
    createdBy: req.body.createdBy
  });

  Vehicle.find({ vehicleNo: req.body.vehicleNo }, (error, foundVehicle) => {
    if (error) {
      return next(error);
    }
    if (foundVehicle && foundVehicle.length > 0) {
      let message = `Vehicle with number (${req.body.vehicleNo}) already exist!`;
      return res.status(404).json({
        message: message
      });
    }
    Vehicle.create(vehicle, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  });
};

// Update a vehicle
const updateVehicle = (req, res, next) => {
  const _id = req.body._id;
  if (!req.params.id || !_id) {
    return res.status(500).json({ message: 'Vehicle ID is required!' });
  }

  Vehicle.findByIdAndUpdate(
    _id,
    {
      $set: {
        ownerName: req.body.ownerName,
        vehicleType: req.body.vehicleType,
        vehicleNo: req.body.vehicleNo.toUpperCase(),
        capacity: req.body.capacity,
        make: req.body.make,
        description: req.body.description,
        regDate: req.body.regDate,
        expDate: req.body.expDate,
        engineNo: req.body.engineNo,
        chassisNo: req.body.chassisNo,
        pucNo: req.body.pucNo,
        pucExpDate: req.body.pucExpDate,
        body: req.body.body,
        taxDetails: req.body.taxDetails,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    });
};

// Remove a vehicle
const removeVehicle = (req, res, next) => {
  if (!req.params.id) {
    return res.status(500).json({ message: 'Vehicle ID is required!' });
  }

  // Vehicle.findByIdAndUpdate(
  //   req.params.id,
  //   {
  //     $set: {
  //       active: false,
  //       updatedBy: req.body.updatedBy
  //     }
  //   },
  //   { new: true },
  //   (error, data) => {
  //     if (error) {
  //       res.status(500).json({ message: error.message });
  //     } else {
  //       res.json({ id: data._id });
  //     }
  //   });
  Vehicle.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json({ id: data._id });
    }
  });
};

// Get banks
const getBanks = (req, res, next) => {
  Bank
    .find({ active: true })
    .limit(100)
    .exec((error, banks) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching banks!"
        });
      } else {
        res.json(banks);
      }
    });
};

// Get a bank
const getBank = (req, res, next) => {
  Bank.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

// Add a bank
const addBank = (req, res, next) => {
  const bank = new Bank({
    name: req.body.name,
    branchName: req.body.branchName,
    branchCode: req.body.branchCode,
    ifsc: req.body.ifsc,
    micr: req.body.micr,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    createdBy: req.body.createdBy
  });

  Bank.find({ ifsc: req.body.ifsc }, (error, foundBank) => {
    if (error) {
      return next(error);
    }
    if (foundBank && foundBank.length > 0) {
      let message = `Bank with ifsc number (${req.body.ifsc}) already exist!`;
      return res.status(404).json({
        message: message
      });
    }
    Bank.create(bank, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  });
};

// Update a bank
const updateBank = (req, res, next) => {
  const _id = req.body._id;
  if (!req.params.id || !_id) {
    return res.status(500).json({ message: 'Bank ID is required!' });
  }

  Bank.findByIdAndUpdate(
    _id,
    {
      $set: {
        name: req.body.name,
        branchName: req.body.branchName,
        branchCode: req.body.branchCode,
        ifsc: req.body.ifsc,
        micr: req.body.micr,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    });
};

// Remove a bank
const removeBank = (req, res, next) => {
  if (!req.params.id) {
    return res.status(500).json({ message: 'Bank ID is required!' });
  }

  Bank.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        active: false,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json({ id: data._id });
      }
    });
};

// Get banks
const getBankAccounts = (req, res, next) => {
  BankAccount
    .find({ active: true })
    .limit(100)
    .exec((error, banks) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching bank accounts!"
        });
      } else {
        res.json(banks);
      }
    });
};

// Get a bank
const getBankAccount = (req, res, next) => {
  BankAccount.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

// Add a bank
const addBankAccount = (req, res, next) => {
  const bankAccount = new BankAccount({
    bank: req.body.bank,
    ifsc: req.body.ifsc,
    accountType: req.body.accountType,
    accountHolder: req.body.accountHolder,
    customerId: req.body.customerId,
    accountNo: req.body.accountNo,
    openingBalance: req.body.openingBalance,
    createdBy: req.body.createdBy
  });

  BankAccount.find({ accountNo: req.body.accountNo }, (error, foundBankAccount) => {
    if (error) {
      return next(error);
    }
    if (foundBankAccount && foundBankAccount.length > 0) {
      let message = `Bank account with account number (${req.body.ifsc}) already exist!`;
      return res.status(404).json({
        message: message
      });
    }
    BankAccount.create(bankAccount, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  });
};

// Update a bank
const updateBankAccount = (req, res, next) => {
  const _id = req.body._id;
  if (!req.params.id || !_id) {
    return res.status(500).json({ message: 'Bank account ID is required!' });
  }

  BankAccount.findByIdAndUpdate(
    _id,
    {
      $set: {
        bank: req.body.bank,
        ifsc: req.body.ifsc,
        accountType: req.body.accountType,
        accountHolder: req.body.accountHolder,
        customerId: req.body.customerId,
        accountNo: req.body.accountNo,
        openingBalance: req.body.openingBalance,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    });
};

// Remove a bank
const removeBankAccount = (req, res, next) => {
  if (!req.params.id) {
    return res.status(500).json({ message: 'Bank account ID is required!' });
  }

  BankAccount.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        active: false,
        updatedBy: req.body.updatedBy
      }
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json({ id: data._id });
      }
    });
};

module.exports = {
  addBranch,
  getBranches,
  getBranch,
  removeBranch,
  updateBranch,
  getPlaces,
  addPlace,
  removePlace,
  updatePlace,
  getPlace,
  addEmployee,
  getEmployees,
  removeEmployee,
  updateEmployee,
  getEmployee,
  getArticles,
  getArticle,
  addArticle,
  removeArticle,
  updateArticle,
  getCustomers,
  getCustomersByBranch,
  getCustomer,
  addCustomer,
  updateCustomer,
  removeCustomer,
  getDrivers,
  getDriver,
  addDriver,
  removeDriver,
  updateDriver,
  getSuppliers,
  getSupplier,
  addSupplier,
  updateSupplier,
  removeSupplier,
  getVehicleTypes,
  getVehicleType,
  addVehicleType,
  removeVehicleType,
  updateVehicleType,
  getVehicles,
  getVehicle,
  addVehicle,
  updateVehicle,
  removeVehicle,
  getBanks,
  getBank,
  addBank,
  updateBank,
  removeBank,
  getBankAccounts,
  getBankAccount,
  addBankAccount,
  updateBankAccount,
  removeBankAccount
};