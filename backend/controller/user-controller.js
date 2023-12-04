const User = require("../models/User.js");
const Employee = require("../models/Employee.js");
const Branch = require("../models/Branch.js");

const signupCtrl = (req, res, next) => {
  const user = new User({
    branch: req.body.branch,
    type: req.body.type,
    employee: req.body.employee,
    username: req.body.username,
    password: req.body.password,
    createdBy: req.body.createdBy,
  });

  User.findOne(
    {
      branch: req.body.branch,
      type: req.body.type,
      employee: req.body.employee,
      username: req.body.username,
    },
    (error, foundUser) => {
      if (error) {
        return next(error);
      }
      if (foundUser) {
        return res.status(404).json({
          message: "User already exist!",
        });
      }
      User.create(user, (error, data) => {
        if (error) {
          res.send(error);
        } else {
          res.send(data);
        }
      });
    }
  );
};

const getUsers = (req, res) => {
  User.find({ active: true }, (error, users) => {
    if (error) {
      return res.status(404).json({
        message: "Error fetching users!",
      });
    } else {
      const updatedUsers = [];
      users.forEach((user) => {
        if (user && user.type && user.type.toLowerCase() !== "superadmin") {
          const updatedUser = {
            branch: user.branch,
            employee: user.employee,
            type: user.type,
            username: user.username,
            id: user._id,
            permissions: user.permissions,
          };
          updatedUsers.push(updatedUser);
        }
      });
      res.json(updatedUsers);
    }
  });
};

const getUser = (req, res, next) => {
  User.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

const getUsersByBranch = (req, res, next) => {
  User.find({ branch: req.params.id, active: true }, (error, users) => {
    if (error) {
      return res.status(404).json({
        message: "Error fetching users!",
      });
    } else {
      const updatedUsers = [];
      users.forEach((user) => {
        const updatedUser = {
          branch: user.branch,
          employee: user.employee,
          type: user.type,
          username: user.username,
          id: user._id,
          permissions: user.permissions,
        };
        updatedUsers.push(updatedUser);
      });
      res.json(updatedUsers);
    }
  });
};

const updateUserPermissions = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.id,
    {
      $set: {
        permissions: req.body.permissions,
        updatedBy: req.body.updatedBy,
      },
    },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    }
  );
};

const removeUser = (req, res, next) => {
  if (!req.params.id) {
    return res.status(500).json({ message: "User ID is required!" });
  }

  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        active: false,
        updatedBy: req.body.updatedBy,
      },
    },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json({ id: data._id });
      }
    }
  );
};

const updateUser = (req, res, next) => {
  User.findOneAndUpdate(
    { username: req.body.username },
    {
      $set: {
        permissions: req.body.permissions,
        branch: req.body.branch,
        password: req.body.password,
        type: req.body.type,
        employee: req.body.employee,
        updatedBy: req.body.updatedBy,
      },
    },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    }
  );
};

const loginCtrl = (req, res, next) => {
  User.findOne({ username: req.body.username }, (error, foundUser) => {
    if (error) {
      return next(error);
    }
    if (foundUser) {
      if (!foundUser.active) {
        return res.status(404).json({
          message: "User is not active!",
        });
      }
      if (req.body.password !== foundUser.password) {
        return res.status(404).json({
          message: "Wrong password!",
        });
      } else {
        const updatedUser = JSON.parse(JSON.stringify(foundUser));
        Employee.findById(updatedUser.employee, (findEmpErr, findEmpData) => {
          if (findEmpErr) {
            return res.status(401).json({ message: findEmpErr.message });
          }
          updatedUser.employee = findEmpData;

          if (foundUser.branch) {
            Branch.findById(
              foundUser.branch,
              (userBranchErr, userBranchData) => {
                if (userBranchErr) {
                  return res
                    .status(401)
                    .json({ message: userBranchErr.message });
                }
                if (userBranchData._id) {
                  updatedUser.branchData = userBranchData;
                  return res.json(updatedUser);
                }
                return res.json(updatedUser);
              }
            );
          } else {
            return res.json(updatedUser);
          }
        });
      }
    }
    if (!error && !foundUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }
  });
};

const getSearchedUsers = (req, res, next) => {
  if (!req.body.search) {
    return res.status(401).json({ message: "Search string is required!" });
  }
  User.find({ $text: { $search: req.body.search } }).exec(function (
    err,
    foundUser
  ) {
    if (err) {
      return next(err);
    } else {
      res.json(foundUser);
    }
  });
};

module.exports = {
  signupCtrl,
  loginCtrl,
  getUsers,
  updateUserPermissions,
  removeUser,
  getUser,
  getUsersByBranch,
  updateUser,
  getSearchedUsers,
};
