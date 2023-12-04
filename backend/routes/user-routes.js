const express = require('express');
const routes = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const userCtrl = require('../controller/user-controller');

// Add a user
routes.route("/signup").post(userCtrl.signupCtrl);

// Login
routes.route("/login").post(userCtrl.loginCtrl);

// Get all users
routes.route('/getUsers').get(userCtrl.getUsers);

// Get a user
routes.route('/getUser/:id').get(userCtrl.getUser);

//Update user
routes.route('/updateUser/:id').put(userCtrl.updateUser);

// Update user permissions
routes.route('/updateUserPermissions').post(userCtrl.updateUserPermissions);

// Delete user
routes.route('/removeUser/:id').delete(userCtrl.removeUser);

// Get users by branch
routes.route('/getUsersByBranch/:id').get(userCtrl.getUsersByBranch);

// User search
routes.route('/getSearchedUsers').post(userCtrl.getSearchedUsers);

module.exports = routes;
