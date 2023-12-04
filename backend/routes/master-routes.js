const express = require('express');
const routes = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const masterCtrl = require('../controller/master-controller');

// Add a branch
routes.route('/addBranch').post(masterCtrl.addBranch);

// Get branches
routes.route('/getBranches').get(masterCtrl.getBranches);

// Get a branches
routes.route('/getBranch/:id').get(masterCtrl.getBranch);

//Delete branch
routes.route('/removeBranch/:id').delete(masterCtrl.removeBranch);

//Update a branch
routes.route('/updateBranch/:id').put(masterCtrl.updateBranch);

// Get places
routes.route('/getPlaces').get(masterCtrl.getPlaces);

//Add a place
routes.route('/addPlace').post(masterCtrl.addPlace);

//Delete place
routes.route('/removePlace/:id').delete(masterCtrl.removePlace);

//Update a place
routes.route('/updatePlace/:id').put(masterCtrl.updatePlace);

// Get a place
routes.route('/getPlace/:id').get(masterCtrl.getPlace);

//Add a employee
routes.route('/addEmployee').post(masterCtrl.addEmployee);

//Add a employee
routes.route('/getEmployees').get(masterCtrl.getEmployees);

//Delete employee
routes.route('/removeEmployee/:id').delete(masterCtrl.removeEmployee);

//Update a employee
routes.route('/updateEmployee/:id').put(masterCtrl.updateEmployee);

// Get a place
routes.route('/getEmployee/:id').get(masterCtrl.getEmployee);

// Get articles
routes.route('/getArticles').get(masterCtrl.getArticles);

//Add a article
routes.route('/addArticle').post(masterCtrl.addArticle);

//Delete article
routes.route('/removeArticle/:id').delete(masterCtrl.removeArticle);

//Update a article
routes.route('/updateArticle/:id').put(masterCtrl.updateArticle);

// Get a article
routes.route('/getArticle/:id').get(masterCtrl.getArticle);

// Get customers
routes.route('/getCustomers').get(masterCtrl.getCustomers);

// Get customers by branch
routes.route('/getCustomersByBranch').post(masterCtrl.getCustomersByBranch);

//Add a customer
routes.route('/addCustomer').post(masterCtrl.addCustomer);

//Delete customer
routes.route('/removeCustomer/:id').delete(masterCtrl.removeCustomer);

//Update a customer
routes.route('/updateCustomer/:id').put(masterCtrl.updateCustomer);

// Get a customer
routes.route('/getCustomer/:id').get(masterCtrl.getCustomer);

// Get drivers
routes.route('/getDrivers').get(masterCtrl.getDrivers);

//Add a driver
routes.route('/addDriver').post(masterCtrl.addDriver);

//Delete driver
routes.route('/removeDriver/:id').delete(masterCtrl.removeDriver);

//Update a driver
routes.route('/updateDriver/:id').put(masterCtrl.updateDriver);

// Get a driver
routes.route('/getDriver/:id').get(masterCtrl.getDriver);

// Get suppliers
routes.route('/getSuppliers').get(masterCtrl.getSuppliers);

//Add a supplier
routes.route('/addSupplier').post(masterCtrl.addSupplier);

//Delete supplier
routes.route('/removeSupplier/:id').delete(masterCtrl.removeSupplier);

//Update a supplier
routes.route('/updateSupplier/:id').put(masterCtrl.updateSupplier);

// Get a supplier
routes.route('/getSupplier/:id').get(masterCtrl.getSupplier);

// Get vehicle types
routes.route('/getVehicleTypes').get(masterCtrl.getVehicleTypes);

//Add a vehicle type
routes.route('/addVehicleType').post(masterCtrl.addVehicleType);

//Delete vehicle type
routes.route('/removeVehicleType/:id').delete(masterCtrl.removeVehicleType);

//Update a vehicle type
routes.route('/updateVehicleType/:id').put(masterCtrl.updateVehicleType);

// Get a vehicle type
routes.route('/getVehicleType/:id').get(masterCtrl.getVehicleType);

// Get vehicles
routes.route('/getVehicles').get(masterCtrl.getVehicles);

//Add a vehicle
routes.route('/addVehicle').post(masterCtrl.addVehicle);

//Delete vehicle
routes.route('/removeVehicle/:id').delete(masterCtrl.removeVehicle);

//Update a vehicle
routes.route('/updateVehicle/:id').put(masterCtrl.updateVehicle);

// Get a vehicle
routes.route('/getVehicle/:id').get(masterCtrl.getVehicle);

// Get banks
routes.route('/getBanks').get(masterCtrl.getBanks);

//Add a bank
routes.route('/addBank').post(masterCtrl.addBank);

//Update a bank
routes.route('/updateBank/:id').put(masterCtrl.updateBank);

// Get a bank
routes.route('/getBank/:id').get(masterCtrl.getBank);

//Delete bank
routes.route('/removeBank/:id').delete(masterCtrl.removeBank);

// Get banks
routes.route('/getBankAccounts').get(masterCtrl.getBankAccounts);

//Add a bank
routes.route('/addBankAccount').post(masterCtrl.addBankAccount);

//Update a bank
routes.route('/updateBankAccount/:id').put(masterCtrl.updateBankAccount);

// Get a bank
routes.route('/getBankAccount/:id').get(masterCtrl.getBankAccount);

//Delete bank
routes.route('/removeBankAccount/:id').delete(masterCtrl.removeBankAccount);

module.exports = routes;