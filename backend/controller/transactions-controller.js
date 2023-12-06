const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const pdf = require("html-pdf");
const options = {
  format: "Letter",
  orientation: "portrait",
  height: "10.5in",
  width: "8in",
};
var fs = require("fs");
const path = require("path");
const html = fs.readFileSync("./bills/LR-Receipt.html", "utf8");

const ExcelJS = require("exceljs");

const LorryReceipt = require("../models/LorryReceipt");
const LoadingSlip = require("../models/LoadingSlip");
const Customer = require("../models/Customer");
const MoneyTransfer = require("../models/MoneyTransfer");
const PettyTransaction = require("../models/PettyTransaction");
const Bill = require("../models/Bill");
const Supplier = require("../models/Supplier");
const Vehicle = require("../models/Vehicle");
const VehicleType = require("../models/VehicleType");
const SuppliersBill = require("../models/SuppliersBill");
const PaymentReceipt = require("../models/PaymentReceipt");

const getLorryReceipts = (req, res, next) => {
  if (!req.body.branch) {
    return res.status(400).json({ message: "Branch ID is required!" });
  }
  LorryReceipt.find({ branch: req.body.branch, active: true })
    .limit(1000)
    .exec((lrError, lorryReceipts) => {
      if (lrError) {
        return res.status(404).json({
          message: "Error fetching lorry receipts!",
        });
      } else {
        res.json(lorryReceipts);
      }
    });
};

const getLorryReceiptsWithCount = (req, res, next) => {
  if (
    !req.body.branch ||
    !req.body.pagination.page ||
    !req.body.pagination.limit
  ) {
    return res
      .status(400)
      .json({ message: "Branch ID & pagination is required!" });
  }

  const limit = req.body.pagination.limit || 1000;
  const skip = req.body.pagination.page * limit - limit;

  // return res.send({ limit: limit, skip: skip });

  LorryReceipt.count(
    { branch: req.body.branch, active: true, type: req.body.type, 
      $or: [
      {"consignor": {
        "$in": [new RegExp(req.body.filterData || "")]
      }},
      {"consigno": {
        "$in": [new RegExp(req.body.filterData || "")]
      }},      
      {"consignee": {
        "$in": [new RegExp(req.body.filterData || "")]
      }},
      {"from": {
        "$in": [new RegExp(req.body.filterData || "")]
      }},
      {"to": {
        "$in": [new RegExp(req.body.filterData || "")]
      }},
      {"date": {
        "$in": [new RegExp(req.body.filterData || "")]
      }}
    ]
    },
    (countErr, count) => {
      
      if (countErr) {
        
        return res.status(404).json({
          message: countErr.toString(),
        });
      } else {
        
        LorryReceipt.find({ branch: req.body.branch, active: true, type: req.body.type, $or: [
          {"consignor": {
            "$in": [new RegExp(req.body.filterData || "")]
          }},
          {"consigno": {
            "$in": [new RegExp(req.body.filterData || "")]
          }}, 
          {"consignee": {
            "$in": [new RegExp(req.body.filterData || "")]
          }},
          {"from": {
            "$in": [new RegExp(req.body.filterData || "")]
          }},
          {"to": {
            "$in": [new RegExp(req.body.filterData || "")]
          }},
          {"date": {
            "$in": [new RegExp(req.body.filterData || "")]
          }}
        ] })
          .limit(limit)
          .skip(skip)
          .sort("-createdAt")
          .exec((lrError, lorryReceipts) => {
            
            if (lrError) {
              return res.status(404).json({
                message: "Error fetching lorry receipts!",
              });
            } else {
              const isLastPage = count - (skip + limit) <= 0;
              res.json({
                lorryReceipts: lorryReceipts,
                count: count,
                isLastPage: isLastPage,
              });
            }
          });
      }
    }
  );
};

const getAllLorryReceiptsWithCount = (req, res, next) => {
  if (!req.body.pagination.page || !req.body.pagination.limit) {
    return res.status(400).json({ message: "Pagination inputs not provided!" });
  }

  const limit = req.body.pagination.limit || 1000;
  const skip = req.body.pagination.page * limit - limit;
  LorryReceipt.count({ active: true, type: req.body.type, branch: req.body.branch, $or: [
    {"consignor": {
      "$in": [new RegExp(req.body.filterData || "")]
    }},
    {"consigno": {
      "$in": [new RegExp(req.body.filterData || "")]
    }}, 
    {"consignee": {
      "$in": [new RegExp(req.body.filterData || "")]
    }},
    {"from": {
      "$in": [new RegExp(req.body.filterData || "")]
    }},
    {"to": {
      "$in": [new RegExp(req.body.filterData || "")]
    }},
    {"date": {
      "$in": [new RegExp(req.body.filterData || "")]
    }}
  ]}, (countErr, count) => {
    if (countErr) {
      return res.status(404).json({
        message: "Error fetching lorry count!",
      });
    } else {
      LorryReceipt.find({ active: true, type: req.body.type, branch: req.body.branch, $or: [
        {"consignor": {
          "$in": [new RegExp(req.body.filterData || "")]
        }},
        {"consigno": {
          "$in": [new RegExp(req.body.filterData || "")]
        }}, 
        {"consignee": {
          "$in": [new RegExp(req.body.filterData || "")]
        }},
        {"from": {
          "$in": [new RegExp(req.body.filterData || "")]
        }},
        {"to": {
          "$in": [new RegExp(req.body.filterData || "")]
        }},
        {"date": {
          "$in": [new RegExp(req.body.filterData || "")]
        }}
      ] })
        .limit(limit)
        .skip(skip)
        .sort("-createdAt")
        .exec((lrError, lorryReceipts) => {
          if (lrError) {
            return res.status(404).json({
              message: "Error fetching lorry receipts!",
            });
          } else {
            const isLastPage = count - (skip + limit) <= 0;
            res.json({
              lorryReceipts: lorryReceipts,
              count: count,
              isLastPage: isLastPage,
            });
          }
        });
    }
  });
};

const getLorryReceiptsWithCountDateRange = (req, res, next) => {
  if (
    !req.body.branch ||
    !req.body.pagination.page ||
    !req.body.pagination.limit
  ) {
    return res
      .status(400)
      .json({ message: "Branch ID & pagination is required!" });
  }

  const limit = req.body.pagination.limit || 1000;
  const skip = req.body.pagination.page * limit - limit;

  // return res.send({ limit: limit, skip: skip });

  LorryReceipt.count(
    {
      branch: req.body.branch,
      date: {
        $gte: req.body.fromDate,
        $lt: req.body.toDate,
      },
      // ack: {
      //   $exists: true,
      // },
      active: true,
    },
    (countErr, count) => {
      if (countErr) {
        return res.status(404).json({
          message: "Error fetching lorry count!",
        });
      } else {
        LorryReceipt.find({
          branch: req.body.branch,
          date: {
            $gte: req.body.fromDate,
            $lt: req.body.toDate,
          },
          // ack: {
          //   $exists: true,
          // },
          active: true,
        })
          .limit(limit)
          .skip(skip)
          .sort("-createdAt")
          .exec((lrError, lorryReceipts) => {
            
            if (lrError) {
              return res.status(404).json({
                message: "Error fetching lorry receipts!",
              });
            } else {
              const isLastPage = count - (skip + limit) <= 0;
              res.json({
                lorryReceipts: lorryReceipts,
                count: count,
                isLastPage: isLastPage,
              });
            }
          });
      }
    }
  );
};

const getAllLorryReceiptsWithCountDateRange = (req, res, next) => {
  if (!req.body.pagination.page || !req.body.pagination.limit) {
    return res.status(400).json({ message: "Pagination inputs not provided!" });
  }

  const limit = req.body.pagination.limit || 1000;
  const skip = req.body.pagination.page * limit - limit;
  LorryReceipt.count({ active: true }, (countErr, count) => {
    if (countErr) {
      return res.status(404).json({
        message: "Error fetching lorry count!",
      });
    } else {
      LorryReceipt.find({
        active: true,
        date: {
          $gte: req.body.fromDate,
          $lt: req.body.toDate,
        },
        // ack: {
        //   $exists: true,
        // },
      })
        .limit(limit)
        .skip(skip)
        .sort("-createdAt")
        .exec((lrError, lorryReceipts) => {
          if (lrError) {
            return res.status(404).json({
              message: "Error fetching lorry receipts!",
            });
          } else {
            const isLastPage = count - (skip + limit) <= 0;
            res.json({
              lorryReceipts: lorryReceipts,
              count: count,
              isLastPage: isLastPage,
            });
          }
        });
    }
  });
};

const getLorryReceiptsByConsignor = (req, res, next) => {
  if (!req.body.branch) {
    return res.status(400).json({ message: "Branch ID is required!" });
  }

  if (!req.body.consignor) {
    return res.status(400).json({ message: "Consignor ID is required!" });
  }

  LorryReceipt.find({
    branch: req.body.branch,
    consignor: req.body.consignor,
    active: true,
  })
    .limit(1000)
    .exec((error, lorryReceipts) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching lorry receipts!",
        });
      } else {
        res.json(lorryReceipts);
      }
    });
};

const addLorryReceipt = async (req, res, next) => {
  const createLorryReceipt = () => {
    const lorryReceipt = new LorryReceipt({
      isBlank: req.body.isBlank,
      branch: req.body.branch,
      mobile: req.body.mobile,
      wayBillNo: req.body.wayBillNo,
      type: req.body.type,
      driverName: req.body.driverName,
      date: req.body.date,
      vehicleNo: req.body.vehicleNo
        ? req.body.vehicleNo.toUpperCase()
        : req.body.vehicleNo,
      vehicleType: req.body.vehicleType
        ? req.body.vehicleType.toUpperCase()
        : req.body.vehicleType,
      consignor: req.body.consignor
        ? req.body.consignor.toUpperCase()
        : req.body.consignor,
      from: req.body.consignorFrom,
      consignee: req.body.consignee
        ? req.body.consignee.toUpperCase()
        : req.body.consignee,
      to: req.body.consigneeTo,
      deliveryAt: req.body.deliveryAt,
      payType: req.body.payType,
      remark: req.body.remark,
      transactions: req.body.transactions,
      unloadTo: req.body.unloadTo,
      unloadDate: req.body.unloadDate,
      unloadBranch: req.body.unloadBranch,
      deliveryDate: req.body.deliveryDate,
      closeAndReason: req.body.closeAndReason,
      serviceType: req.body.serviceType,
      createdBy: req.body.createdBy,
    });

    LorryReceipt.findOne(
      {},
      {},
      { sort: { createdAt: -1 } },
      function (err, foundLR) {
        if (foundLR) {
          lorryReceipt.lrNo = foundLR.lrNo + 1; 
        } else {
          lorryReceipt.lrNo = 1;          
        }
        lorryReceipt.consigno = dayjs(req.body.date).format("MM/DD/YY")+"_" + lorryReceipt.lrNo.toString().padStart(6, '0')
        LorryReceipt.create(lorryReceipt, (error, data) => {
          if (error) {
            res.send(error);
          } else {
            res.send(data);
          }
        });
      }
    );
  };

  try {
    if (req.body.isBlank) {
      createLorryReceipt();
      return;
    }
    const foundVehicle = await Vehicle.findOne({
      vehicleNo: req.body.vehicleNo.toUpperCase(),
    });
    const foundVehicleType = await VehicleType.findOne({
      type: req.body.vehicleType.toUpperCase(),
    });

    const foundConsignor = await Customer.findOne({
      name: req.body.consignor.toUpperCase(),
      type: "Consignor",
    });

    const foundConsignee = await Customer.findOne({
      name: req.body.consignee.toUpperCase(),
      type: "Consignee",
    });
    let createdVehicleType;
    let createdVehicle;
    let createdConsignor;
    let createdConsignee;

    if (foundVehicle && foundVehicleType && foundConsignor && foundConsignee) {
      createLorryReceipt();
    } else {
      if (!foundVehicleType || !foundVehicleType.type) {
        createdVehicleType = await VehicleType.create({
          type: req.body.vehicleType.toUpperCase(),
          createdBy: req.body.createdBy,
        });
        if (createdVehicleType && createdVehicleType.type) {
          if (!foundVehicle || !foundVehicle.vehicleNo) {
            createdVehicle = await Vehicle.create({
              vehicleNo: req.body.vehicleNo.toUpperCase(),
              vehicleType: req.body.vehicleType,
              createdBy: req.body.createdBy,
            });
            if (createdVehicle && createdVehicle.vehicleNo) {
              //createLorryReceipt();
              if (!foundConsignor && !foundConsignee) {
                createdConsignor = await Customer.create({
                  name: req.body.consignor.toUpperCase(),
                  type: "Consignor",
                  gstNo: req.body.consignorGst,
                  address: req.body.consignorAddress,
                  city: req.body.consignorFrom,
                  createdBy: req.body.createdBy,
                });
                createdConsignee = await Customer.create({
                  name: req.body.consignee.toUpperCase(),
                  type: "Consignee",
                  gstNo: req.body.consigneeGst,
                  address: req.body.consigneeAddress,
                  city: req.body.consigneeTo,
                  createdBy: req.body.createdBy,
                });
                if (createdConsignor && createdConsignee) {
                  createLorryReceipt();
                }
              }
              if (foundConsignor && !foundConsignee) {
                createdConsignee = await Customer.create({
                  name: req.body.consignee.toUpperCase(),
                  type: "Consignee",
                  gstNo: req.body.consigneeGst,
                  address: req.body.consigneeAddress,
                  city: req.body.consigneeTo,
                  createdBy: req.body.createdBy,
                });
                createLorryReceipt();
              }
              if (!foundConsignor && foundConsignee) {
                createdConsignor = await Customer.create({
                  name: req.body.consignor.toUpperCase(),
                  type: "Consignor",
                  gstNo: req.body.consignorGst,
                  address: req.body.consignorAddress,
                  city: req.body.consignorFrom,
                  createdBy: req.body.createdBy,
                });
                createLorryReceipt();
              }
            }
          } else {
            if (!foundConsignor && !foundConsignee) {
              createdConsignor = await Customer.create({
                name: req.body.consignor.toUpperCase(),
                type: "Consignor",
                gstNo: req.body.consignorGst,
                address: req.body.consignorAddress,
                city: req.body.consignorFrom,
                createdBy: req.body.createdBy,
              });
              createdConsignee = await Customer.create({
                name: req.body.consignee.toUpperCase(),
                type: "Consignee",
                gstNo: req.body.consigneeGst,
                address: req.body.consigneeAddress,
                city: req.body.consigneeTo,
                createdBy: req.body.createdBy,
              });
              if (createdConsignor && createdConsignee) {
                createLorryReceipt();
              }
            }
            if (foundConsignor && !foundConsignee) {
              createdConsignee = await Customer.create({
                name: req.body.consignee.toUpperCase(),
                type: "Consignee",
                gstNo: req.body.consigneeGst,
                address: req.body.consigneeAddress,
                city: req.body.consigneeTo,
                createdBy: req.body.createdBy,
              });
              createLorryReceipt();
            }
            if (!foundConsignor && foundConsignee) {
              createdConsignor = await Customer.create({
                name: req.body.consignor.toUpperCase(),
                type: "Consignor",
                gstNo: req.body.consignorGst,
                address: req.body.consignorAddress,
                city: req.body.consignorFrom,
                createdBy: req.body.createdBy,
              });
              createLorryReceipt();
            }
          }
        }
      } else {
        if (!foundVehicle || !foundVehicle.vehicleNo) {
          createdVehicle = await Vehicle.create({
            vehicleNo: req.body.vehicleNo.toUpperCase(),
            vehicleType: req.body.vehicleType,
            createdBy: req.body.createdBy,
          });
          if (createdVehicle && createdVehicle.vehicleNo) {
            if (!foundConsignor && !foundConsignee) {
              createdConsignor = await Customer.create({
                name: req.body.consignor.toUpperCase(),
                type: "Consignor",
                gstNo: req.body.consignorGst,
                address: req.body.consignorAddress,
                city: req.body.consignorFrom,
                createdBy: req.body.createdBy,
              });
              createdConsignee = await Customer.create({
                name: req.body.consignee.toUpperCase(),
                type: "Consignee",
                gstNo: req.body.consigneeGst,
                address: req.body.consigneeAddress,
                city: req.body.consigneeTo,
                createdBy: req.body.createdBy,
              });
              if (createdConsignor && createdConsignee) {
                createLorryReceipt();
              }
            }
            if (foundConsignor && !foundConsignee) {
              createdConsignee = await Customer.create({
                name: req.body.consignee.toUpperCase(),
                type: "Consignee",
                gstNo: req.body.consigneeGst,
                address: req.body.consigneeAddress,
                city: req.body.consigneeTo,
                createdBy: req.body.createdBy,
              });
              createLorryReceipt();
            }
            if (!foundConsignor && foundConsignee) {
              createdConsignor = await Customer.create({
                name: req.body.consignor.toUpperCase(),
                type: "Consignor",
                gstNo: req.body.consignorGst,
                address: req.body.consignorAddress,
                city: req.body.consignorFrom,
                createdBy: req.body.createdBy,
              });
              createLorryReceipt();
            }
          }
        } else {
          if (!foundConsignor && !foundConsignee) {
            createdConsignor = await Customer.create({
              name: req.body.consignor.toUpperCase(),
              type: "Consignor",
              gstNo: req.body.consignorGst,
              address: req.body.consignorAddress,
              city: req.body.consignorFrom,
              createdBy: req.body.createdBy,
            });
            createdConsignee = await Customer.create({
              name: req.body.consignee.toUpperCase(),
              type: "Consignee",
              gstNo: req.body.consigneeGst,
              address: req.body.consigneeAddress,
              city: req.body.consigneeTo,
              createdBy: req.body.createdBy,
            });
            if (createdConsignor && createdConsignee) {
              createLorryReceipt();
            }
          }
          if (foundConsignor && !foundConsignee) {
            createdConsignee = await Customer.create({
              name: req.body.consignee.toUpperCase(),
              type: "Consignee",
              gstNo: req.body.consigneeGst,
              address: req.body.consigneeAddress,
              city: req.body.consigneeTo,
              createdBy: req.body.createdBy,
            });
            createLorryReceipt();
          }
          if (!foundConsignor && foundConsignee) {
            createdConsignor = await Customer.create({
              name: req.body.consignor.toUpperCase(),
              type: "Consignor",
              gstNo: req.body.consignorGst,
              address: req.body.consignorAddress,
              city: req.body.consignorFrom,
              createdBy: req.body.createdBy,
            });
            createLorryReceipt();
          }
        }
      }
    }
  } catch (e) {
    return res.status(401).json({ message: e.message });
  }
};

const removeLorryReceipt = (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Lorry receipt ID is required!" });
  }

  // LorryReceipt.findByIdAndUpdate(
  //   req.params.id,
  //   {
  //     $set: {
  //       active: false,
  //       updatedBy: req.body.empId
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
  LorryReceipt.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json({ id: data._id });
    }
  });
};

const viewLorryReceipt = (req, res, next) => {
  let LRData;
  let fetchedConsignor;
  let fetchedConsignee;

  LorryReceipt.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      LRData = JSON.parse(JSON.stringify(data));
      LRData.date = getFormattedDate(data.date);
      LRData.LRNo = LRData.wayBillNo;
      const total = {
        boxQuantity: 0,
        popQuantity: 0,
        looseQuantity: 0,
        loosePiece: 0,
      };
      LRData.transactions.forEach((transaction, index) => {
        transaction.sr = index + 1;
        total.boxQuantity = total.boxQuantity + transaction.boxQuantity;
        total.popQuantity = total.popQuantity + transaction.popQuantity;
        total.looseQuantity = total.looseQuantity + transaction.looseQuantity;
        total.loosePiece = total.loosePiece + transaction.loosePiece;
      });
      const blankRows = [];
      if (LRData.transactions.length < 8) {
        for (let i = LRData.transactions.length; i < 20; i = i + 1) {
          blankRows.push({ sr: "-" });
        }
      }
      LRData.blank = blankRows;

      Customer.findOne(
        { name: LRData.consignee.toUpperCase() },
        (consigneeError, consignee) => {
          if (consigneeError) {
            return res.status(400).json({ message: consigneeError.message });
          }
          fetchedConsignee = consignee;
          Customer.findOne(
            { name: LRData.consignor.toUpperCase() },
            (consignorError, consignor) => {
              if (consignorError) {
                return res
                  .status(400)
                  .json({ message: consignorError.message });
              }
              fetchedConsignor = consignor;

              Vehicle.findOne(
                { vehicleNo: LRData.vehicleNo.toUpperCase() },
                (vehicleErr, vehicleData) => {
                  if (vehicleErr) {
                    return res
                      .status(400)
                      .json({ message: vehicleErr.message });
                  }
                  if (vehicleData._id) {
                    VehicleType.findOne(
                      {
                        type: vehicleData.vehicleType.toUpperCase(),
                      },
                      (vehicleTypeErr, vehicleTypeData) => {
                        if (vehicleTypeErr) {
                          return res
                            .status(400)
                            .json({ message: vehicleTypeErr.message });
                        }
                        const templatePath =
                          path.join(__dirname, "../bills/") +
                          "LR-Receipt-JRV.html";
                        res.render(
                          templatePath,
                          {
                            info: {
                              lr: LRData,
                              consignee: fetchedConsignee,
                              consignor: fetchedConsignor,
                              vehicleType: vehicleTypeData,
                              total: total,
                            },
                          },
                          (err, HTML) => {
                            const finalPath = path.join(__dirname, "../bills/");
                            const fileName = getFormattedLRNo(
                              pad(LRData.lrNo, 6)
                            );
                            pdf
                              .create(HTML, options)
                              .toFile(
                                path.join(finalPath, fileName + ".pdf"),
                                (err, result) => {
                                  if (err) {
                                    return res.status(400).send({
                                      message: err,
                                    });
                                  }
                                  return res.sendFile(result.filename);
                                }
                              );
                          }
                        );
                      }
                    );
                  } else {
                    res.json({ message: "Vehicle not found" });
                  }
                }
              );
            }
          );
        }
      );
    }
  });
};

const getLorryReceipt = (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Lorry receipt ID is required!" });
  }
  LorryReceipt.findById(req.params.id, (error, data) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    res.send(data);
  });
};

const updateLorryReceipt = async (req, res, next) => {
  const _id = req.body._id;

  if (!req.params.id || !_id) {
    return res.status(500).json({ message: "Lorry receipt ID is required!" });
  }
  const updateLorryReceipt = () => {
    LorryReceipt.findByIdAndUpdate(
      _id,
      {
        $set: {
          isBlank: req.body.isBlank,
          branch: req.body.branch,
          date: req.body.date,
          invoiceNo: req.body.invoiceNo,
          vehicleNo: req.body.vehicleNo
            ? req.body.vehicleNo.toUpperCase()
            : req.body.vehicleNo,
          vehicleType: req.body.vehicleType
            ? req.body.vehicleType.toUpperCase()
            : req.body.vehicleType,
          consignor: req.body.consignor
            ? req.body.consignor.toUpperCase()
            : req.body.consignor,
          from: req.body.consignorFrom,
          consignee: req.body.consignee
            ? req.body.consignee.toUpperCase()
            : req.body.consignee,
          to: req.body.consigneeTo,
          deliveryAt: req.body.deliveryAt,
          payType: req.body.payType,
          remark: req.body.remark,
          transactions: req.body.transactions,
          unloadTo: req.body.unloadTo,
          unloadDate: req.body.unloadDate,
          unloadBranch: req.body.unloadBranch,
          deliveryDate: req.body.deliveryDate,
          closeAndReason: req.body.closeAndReason,
          serviceType: req.body.serviceType,
          updatedBy: req.body.updatedBy,
        },
      },
      { new: true },
      (error, data) => {
        if (error) {
          res.status(500).json({ message: error.message });
        } else {
          res.json(data);
        }
      }
    );
  };

  try {
    if (req.body.isBlank) {
      updateLorryReceipt();
      return;
    }
    const foundVehicle = await Vehicle.findOne({
      vehicleNo: req.body.vehicleNo.toUpperCase(),
    });
    const foundVehicleType = await VehicleType.findOne({
      type: req.body.vehicleType.toUpperCase(),
    });

    const foundConsignor = await Customer.findOne({
      name: req.body.consignor.toUpperCase(),
      type: "Consignor",
    });

    const foundConsignee = await Customer.findOne({
      name: req.body.consignee.toUpperCase(),
      type: "Consignee",
    });
    let createdVehicleType;
    let createdVehicle;
    let createdConsignor;
    let createdConsignee;

    if (foundVehicleType && foundVehicle && foundConsignor && foundConsignee) {
      updateLorryReceipt();
    } else {
      if (!foundVehicleType || !foundVehicleType.type) {
        createdVehicleType = await VehicleType.create({
          type: req.body.vehicleType.toUpperCase(),
          createdBy: req.body.createdBy,
        });
        if (createdVehicleType && createdVehicleType.type) {
          if (!foundVehicle || !foundVehicle.vehicleNo) {
            createdVehicle = await Vehicle.create({
              vehicleNo: req.body.vehicleNo.toUpperCase(),
              vehicleType: req.body.vehicleType,
              createdBy: req.body.createdBy,
            });
            if (createdVehicle && createdVehicle.vehicleNo) {
              if (!foundConsignor && !foundConsignee) {
                createdConsignor = await Customer.create({
                  name: req.body.consignor.toUpperCase(),
                  type: "Consignor",
                  gstNo: req.body.consignorGst,
                  address: req.body.consignorAddress,
                  city: req.body.consignorFrom,
                  createdBy: req.body.createdBy,
                });
                createdConsignee = await Customer.create({
                  name: req.body.consignee.toUpperCase(),
                  type: "Consignee",
                  gstNo: req.body.consigneeGst,
                  address: req.body.consigneeAddress,
                  city: req.body.consigneeTo,
                  createdBy: req.body.createdBy,
                });
                if (createdConsignor && createdConsignee) {
                  updateLorryReceipt();
                }
              }
              if (foundConsignor && !foundConsignee) {
                createdConsignee = await Customer.create({
                  name: req.body.consignee.toUpperCase(),
                  type: "Consignee",
                  gstNo: req.body.consigneeGst,
                  address: req.body.consigneeAddress,
                  city: req.body.consigneeTo,
                  createdBy: req.body.createdBy,
                });
                updateLorryReceipt();
              }
              if (!foundConsignor && foundConsignee) {
                createdConsignor = await Customer.create({
                  name: req.body.consignor.toUpperCase(),
                  type: "Consignor",
                  gstNo: req.body.consignorGst,
                  address: req.body.consignorAddress,
                  city: req.body.consignorFrom,
                  createdBy: req.body.createdBy,
                });
                updateLorryReceipt();
              }
            }
          } else {
            if (!foundConsignor && !foundConsignee) {
              createdConsignor = await Customer.create({
                name: req.body.consignor.toUpperCase(),
                type: "Consignor",
                gstNo: req.body.consignorGst,
                address: req.body.consignorAddress,
                city: req.body.consignorFrom,
                createdBy: req.body.createdBy,
              });
              createdConsignee = await Customer.create({
                name: req.body.consignee.toUpperCase(),
                type: "Consignee",
                gstNo: req.body.consigneeGst,
                address: req.body.consigneeAddress,
                city: req.body.consigneeTo,
                createdBy: req.body.createdBy,
              });
              if (createdConsignor && createdConsignee) {
                updateLorryReceipt();
              }
            }
            if (foundConsignor && !foundConsignee) {
              createdConsignee = await Customer.create({
                name: req.body.consignee.toUpperCase(),
                type: "Consignee",
                gstNo: req.body.consigneeGst,
                address: req.body.consigneeAddress,
                city: req.body.consigneeTo,
                createdBy: req.body.createdBy,
              });
              updateLorryReceipt();
            }
            if (!foundConsignor && foundConsignee) {
              createdConsignor = await Customer.create({
                name: req.body.consignor.toUpperCase(),
                type: "Consignor",
                gstNo: req.body.consignorGst,
                address: req.body.consignorAddress,
                city: req.body.consignorFrom,
                createdBy: req.body.createdBy,
              });
              updateLorryReceipt();
            }
          }
        }
      } else {
        if (!foundVehicle || !foundVehicle.vehicleNo) {
          createdVehicle = await Vehicle.create({
            vehicleNo: req.body.vehicleNo.toUpperCase(),
            vehicleType: req.body.vehicleType,
            createdBy: req.body.createdBy,
          });
          if (createdVehicle && createdVehicle.vehicleNo) {
            if (!foundConsignor && !foundConsignee) {
              createdConsignor = await Customer.create({
                name: req.body.consignor.toUpperCase(),
                type: "Consignor",
                gstNo: req.body.consignorGst,
                address: req.body.consignorAddress,
                city: req.body.consignorFrom,
                createdBy: req.body.createdBy,
              });
              createdConsignee = await Customer.create({
                name: req.body.consignee.toUpperCase(),
                type: "Consignee",
                gstNo: req.body.consigneeGst,
                address: req.body.consigneeAddress,
                city: req.body.consigneeTo,
                createdBy: req.body.createdBy,
              });
              if (createdConsignor && createdConsignee) {
                updateLorryReceipt();
              }
            }
            if (foundConsignor && !foundConsignee) {
              createdConsignee = await Customer.create({
                name: req.body.consignee.toUpperCase(),
                type: "Consignee",
                gstNo: req.body.consigneeGst,
                address: req.body.consigneeAddress,
                city: req.body.consigneeTo,
                createdBy: req.body.createdBy,
              });
              updateLorryReceipt();
            }
            if (!foundConsignor && foundConsignee) {
              createdConsignor = await Customer.create({
                name: req.body.consignor.toUpperCase(),
                type: "Consignor",
                gstNo: req.body.consignorGst,
                address: req.body.consignorAddress,
                city: req.body.consignorFrom,
                createdBy: req.body.createdBy,
              });
              updateLorryReceipt();
            }
          }
        } else {
          if (!foundConsignor && !foundConsignee) {
            createdConsignor = await Customer.create({
              name: req.body.consignor.toUpperCase(),
              type: "Consignor",
              gstNo: req.body.consignorGst,
              address: req.body.consignorAddress,
              city: req.body.consignorFrom,
              createdBy: req.body.createdBy,
            });
            createdConsignee = await Customer.create({
              name: req.body.consignee.toUpperCase(),
              type: "Consignee",
              gstNo: req.body.consigneeGst,
              address: req.body.consigneeAddress,
              city: req.body.consigneeTo,
              createdBy: req.body.createdBy,
            });
            if (createdConsignor && createdConsignee) {
              updateLorryReceipt();
            }
          }
          if (foundConsignor && !foundConsignee) {
            createdConsignee = await Customer.create({
              name: req.body.consignee.toUpperCase(),
              type: "Consignee",
              gstNo: req.body.consigneeGst,
              address: req.body.consigneeAddress,
              city: req.body.consigneeTo,
              createdBy: req.body.createdBy,
            });
            updateLorryReceipt();
          }
          if (!foundConsignor && foundConsignee) {
            createdConsignor = await Customer.create({
              name: req.body.consignor.toUpperCase(),
              type: "Consignor",
              gstNo: req.body.consignorGst,
              address: req.body.consignorAddress,
              city: req.body.consignorFrom,
              createdBy: req.body.createdBy,
            });
            updateLorryReceipt();
          }
        }
      }
    }
  } catch (e) {
    return res.status(401).json({ message: e.message });
  }
};

const updateLorryReceiptDateRange = async (req, res, next) => {
  const docs = req.body.docs;
  const updateLorryReceipt = (body, index) => {
    LorryReceipt.findByIdAndUpdate(
      body._id,
      {
        $set: {
          remark: body.remark,
          yesNo: body.yesNo,
        },
      },
      { new: true },
      (error, data) => {
        if (error) {
          res.status(500).json({ message: error.message });
        } else {
          if (index === docs.length - 1) {
            res.json(data);
          }
        }
      }
    );
  };

  docs.map((body, index) => {
    updateLorryReceipt(body, index);
  });
};

const updateLorryReceiptAck = (req, res, next) => {
  const _id = req.params.id || req.body._id;

  if (!_id) {
    return res.status(500).json({ message: "Lorry receipt ID is required!" });
  }

  let filePath = "";
  if (req.alreadyExist) {
    res
      .status(401)
      .json({ message: "POD for the lorry receipt is already uploaded" });
  }
  if (req.file) {
    const url = "http://" + req.get("host") + "/acknowledgement/";
    filePath = url + req.file.filename;
  }

  LorryReceipt.findByIdAndUpdate(
    _id,
    {
      $set: {
        ack: filePath,
        updatedBy: req.body.updatedBy,
      },
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    }
  );
};

const removeLorryReceiptAck = (req, res) => {
  const _id = req.params.id;

  if (!_id) {
    return res.status(500).json({ message: "Lorry receipt ID is required!" });
  }

  LorryReceipt.findById(_id, (foundLRErr, foundLRData) => {
    if (foundLRErr) {
      return res.status(400).json({ message: foundLRErr.message });
    }

    if (foundLRData && foundLRData.ack) {
      const filePath = foundLRData.ack;
      const parts = filePath.split("/");
      const fileName = parts[parts.length - 1];
      const fileToRemove = path.join(
        __dirname,
        "../acknowledgement/",
        fileName
      );
      fs.unlinkSync(fileToRemove);

      LorryReceipt.findByIdAndUpdate(
        _id,
        {
          $set: {
            ack: "",
            updatedBy: req.body.updatedBy,
          },
        },
        { new: true },
        (error, data) => {
          if (error) {
            res.status(500).json({ message: error.message });
          } else {
            res.json(data);
          }
        }
      );
    }
    if (!foundLRData) {
      return res.status(400).json({ message: "Lorry receipt not found!" });
    }
  });
};

const getLoadingSlips = (req, res, next) => {
  if (!req.body.branch) {
    return res.status(400).json({ message: "Branch ID is required!" });
  }

  LoadingSlip.find({ branch: req.body.branch, active: true })
    .limit(1000)
    .exec((error, loadingSlips) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching loading slips!",
        });
      } else {
        res.json(loadingSlips);
      }
    });
};

const getLoadingSlipsById = (req, res, next) => {
  LoadingSlip.find(
    {
      _id: { $in: req.body.lsList },
    },
    (error, loadingSlips) => {
      if (error) {
        res.send(error);
      }
      res.send(loadingSlips);
    }
  );
};

const addLoadingSlip = (req, res, next) => {
  const loadingSlip = new LoadingSlip({
    branch: req.body.branch,
    date: req.body.date,
    vehicleNo: req.body.vehicleNo,
    vehicleOwner: req.body.vehicleOwner,
    vehicleOwnerAddress: req.body.vehicleOwnerAddress,
    driverName: req.body.driverName,
    licenseNo: req.body.licenseNo,
    mobile: req.body.mobile,
    from: req.body.from,
    to: req.body.to,
    lrList: req.body.lrList,
    toPay: +req.body.toPay,
    billed: +req.body.billed,
    hire: +req.body.hire,
    advance: +req.body.advance,
    commission: +req.body.commission,
    hamali: +req.body.hamali,
    stacking: +req.body.stacking,
    total: +req.body.total,
    ackBranch: req.body.ackBranch,
    remark: req.body.remark,
    isLocalMemo: req.body.isLocalMemo ? req.body.isLocalMemo : false,
    createdBy: req.body.createdBy,
  });

  LoadingSlip.findOne(
    {},
    {},
    { sort: { createdAt: -1 } },
    function (err, foundLS) {
      if (foundLS) {
        loadingSlip.lsNo = foundLS.lsNo + 1;
      } else {
        loadingSlip.lsNo = 1;
      }
      LoadingSlip.create(loadingSlip, (error, data) => {
        if (error) {
          res.send(error);
        } else {
          const allLR = req.body.lrList.map((lr) => lr._id);
          LorryReceipt.updateMany(
            { _id: { $in: allLR } },
            {
              $set: {
                status: 1,
                associatedLS: data._id,
                updatedBy: req.body.createdBy,
              },
            },
            { multi: true },
            (error, updatedLR) => {
              if (!error) {
                res.send(data);
              } else {
                res.send(error);
              }
            }
          );
        }
      });
    }
  );
};

const removeLoadingSlip = (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Loading slip ID is required!" });
  }

  LoadingSlip.findById(req.params.id, (error, loadingSlip) => {
    if (error) {
      return res.status(400).json({ message: "Loading slip not found!" });
    }

    LoadingSlip.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          active: false,
          updatedBy: req.body.updatedBy,
        },
      },
      { new: true },
      (error, data) => {
        if (error) {
          res.status(500).json({ message: error.message });
        } else {
          LorryReceipt.updateMany(
            { associatedLS: data._id },
            {
              $set: {
                status: 0,
                associatedLS: "",
                updatedBy: req.body.updatedBy,
              },
            },
            { multi: true },
            (error, removedAssciationData) => {
              if (!error) {
                res.send({ id: data._id });
              } else {
                res.send(error);
              }
            }
          );
        }
      }
    );

    const allLR = loadingSlip.lrList.map((lr) => lr._id);
    LorryReceipt.updateMany(
      { _id: { $in: allLR } },
      { $set: { status: 0, associatedLS: "", updatedBy: req.body.updatedBy } },
      { multi: true },
      (error, updatedLR) => {
        if (!error) {
          LoadingSlip.findByIdAndUpdate(
            req.params.id,
            { $set: { active: false, updatedBy: req.body.updatedBy } },
            (lsError, data) => {
              if (lsError) {
                return res.status(400).json({ message: lsError.message });
              } else {
                res.status(200).json({ id: req.params.id });
              }
            }
          );
        } else {
          res.send(error);
        }
      }
    );
  });
};

const updateLoadingSlip = (req, res, next) => {
  const _id = req.body._id;

  if (!req.params.id || !_id) {
    return res.status(500).json({ message: "Loading slip ID is required!" });
  }

  LoadingSlip.findByIdAndUpdate(
    _id,
    {
      $set: {
        branch: req.body.branch,
        date: req.body.date,
        vehicleNo: req.body.vehicleNo,
        vehicleOwner: req.body.vehicleOwner,
        vehicleOwnerAddress: req.body.vehicleOwnerAddress,
        driverName: req.body.driverName,
        licenseNo: req.body.licenseNo,
        mobile: req.body.mobile,
        from: req.body.from,
        to: req.body.to,
        lrList: req.body.lrList,
        toPay: +req.body.toPay,
        billed: +req.body.billed,
        hire: +req.body.hire,
        advance: +req.body.advance,
        commission: +req.body.commission,
        hamali: +req.body.hamali,
        stacking: +req.body.stacking,
        total: +req.body.total,
        ackBranch: req.body.ackBranch,
        remark: req.body.remark,
        updatedBy: req.body.updatedBy,
        isLocalMemo: req.body.isLocalMemo ? req.body.isLocalMemo : false,
      },
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        LorryReceipt.updateMany(
          { associatedLS: data._id },
          {
            $set: {
              status: 0,
              associatedLS: "",
              updatedBy: req.body.updatedBy,
            },
          },
          { multi: true },
          (error, removedAssciationData) => {
            if (!error) {
              const allLR = req.body.lrList.map((lr) => lr._id);
              LorryReceipt.updateMany(
                { _id: { $in: allLR } },
                {
                  $set: {
                    status: 1,
                    associatedLS: data._id,
                    updatedBy: req.body.updatedBy,
                  },
                },
                { multi: true },
                (error, updatedLR) => {
                  if (!error) {
                    res.send(data);
                  } else {
                    res.send(error);
                  }
                }
              );
            } else {
              res.send(error);
            }
          }
        );
      }
    }
  );
};

const getLoadingSlip = (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Loading slip ID is required!" });
  }
  LoadingSlip.findById(req.params.id, (error, data) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    res.send(data);
  });
};

const getMoneyTransfers = (req, res, next) => {
  if (!req.body.branch) {
    return res.status(400).json({ message: "Branch ID is required!" });
  }

  MoneyTransfer.find({ branch: req.body.branch, active: true })
    .limit(1000)
    .exec((error, moneyTransfers) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching money transfer list!",
        });
      } else {
        res.json(moneyTransfers);
      }
    });
};

const addMoneyTransfer = (req, res, next) => {
  const moneyTransfer = new MoneyTransfer({
    branch: req.body.branch,
    transferToBranch: req.body.transferToBranch,
    date: req.body.date,
    amount: req.body.amount,
    remark: req.body.remark,
    createdBy: req.body.createdBy,
  });

  MoneyTransfer.findOne(
    {},
    {},
    { sort: { createdAt: -1 } },
    function (err, foundMT) {
      if (foundMT) {
        moneyTransfer.pettyCashNo = foundMT.pettyCashNo + 1;
      } else {
        moneyTransfer.pettyCashNo = 1;
      }
      MoneyTransfer.create(moneyTransfer, (error, data) => {
        if (error) {
          res.send(error);
        } else {
          res.send(data);
        }
      });
    }
  );
};

const removeMoneyTransfer = (req, res, next) => {
  if (!req.params.id || !req.body.id) {
    return res.status(400).json({ message: "Money transfer ID is required!" });
  }
  const _id = req.body.id || req.params.id;
  MoneyTransfer.findByIdAndUpdate(
    _id,
    {
      $set: {
        active: false,
        updatedBy: req.body.updatedBy,
      },
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    }
  );
};

const updateMoneyTransfer = (req, res, next) => {
  const _id = req.body._id;

  if (!req.params.id || !_id) {
    return res.status(500).json({ message: "Money transfer ID is required!" });
  }

  MoneyTransfer.findByIdAndUpdate(
    _id,
    {
      $set: {
        branch: req.body.branch,
        transferToBranch: req.body.transferToBranch,
        date: req.body.date,
        amount: req.body.amount,
        remark: req.body.remark,
        updatedBy: req.body.updatedBy,
      },
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    }
  );
};

const getMoneyTransfer = (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Money transfer ID is required!" });
  }
  MoneyTransfer.findById(req.params.id, (error, data) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    res.send(data);
  });
};

const getPettyTransactions = (req, res, next) => {
  if (!req.body.branch) {
    return res.status(400).json({ message: "Branch ID is required!" });
  }

  PettyTransaction.find({ branch: req.body.branch })
    .limit(1000)
    .exec((error, pettyTransactions) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching petty cash transactions!",
        });
      } else {
        res.json(pettyTransactions);
      }
    });
};

const addPettyTransaction = (req, res, next) => {
  const pettyTransaction = new PettyTransaction({
    branch: req.body.branch,
    transactionType: req.body.transactionType,
    transactionName: req.body.transactionName,
    type: req.body.type,
    lsNo: req.body.lsNo,
    amount: +req.body.amount,
    availableBal: +req.body.availableBal,
    date: req.body.date,
    bank: req.body.bank,
    bankAccountNumber: req.body.bankAccountNumber,
    description: req.body.description,
    createdBy: req.body.createdBy,
  });

  PettyTransaction.findOne(
    {},
    {},
    { sort: { createdAt: -1 } },
    function (err, foundPT) {
      if (foundPT) {
        pettyTransaction.transactionNo = foundPT.transactionNo + 1;
        if (pettyTransaction.type.toLowerCase() === "credit") {
          pettyTransaction.availableBal =
            pettyTransaction.amount + foundPT.availableBal;
        }
        if (pettyTransaction.type.toLowerCase() === "debit") {
          pettyTransaction.availableBal =
            foundPT.availableBal - pettyTransaction.amount;
        }
      } else {
        pettyTransaction.transactionNo = 1;
        if (pettyTransaction.type.toLowerCase() === "credit") {
          pettyTransaction.availableBal = pettyTransaction.amount;
        }
        if (pettyTransaction.type.toLowerCase() === "debit") {
          pettyTransaction.availableBal =
            pettyTransaction.availableBal - pettyTransaction.amount;
        }
      }
      PettyTransaction.create(pettyTransaction, (error, data) => {
        if (error) {
          res.send(error);
        } else {
          res.send(data);
        }
      });
    }
  );
};

const getPettyCashBalance = (req, res, next) => {
  PettyTransaction.findOne(
    {},
    {},
    { sort: { createdAt: -1 } },
    function (error, foundPT) {
      if (error) {
        res.send(error);
      }
      if (foundPT && foundPT.availableBal) {
        res.send({ balance: foundPT.availableBal });
      } else {
        res.send({ balance: 0 });
      }
    }
  );
};

const getPettyTransactionsByDate = (req, res, next) => {
  if (!req.body.startDate || !req.body.endDate) {
    return res
      .status(400)
      .json({ message: "Start and end dates are required!" });
  }
  PettyTransaction.find(
    {
      createdAt: {
        $gte: new Date(req.body.startDate),
        $lte: new Date(req.body.endDate),
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

const getLorryReceiptsByDate = (req, res, next) => {
  if (!req.body.startDate || !req.body.endDate) {
    return res
      .status(400)
      .json({ message: "Start and end dates are required!" });
  }
  let searchCriteria = {
    createdAt: {
      $gte: new Date(req.body.startDate),
      $lte: new Date(req.body.endDate),
    },
  };

  if (req.body.type === "loaded") {
    searchCriteria.status = 1;
  }
  if (req.body.type === "unloaded") {
    searchCriteria.unloadDate = { $exists: true, $ne: null };
  }

  LorryReceipt.find(searchCriteria, (error, data) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(data);
    }
  });
};

const getBills = (req, res, next) => {
  if (!req.body.branch) {
    return res.status(400).json({ message: "Branch ID is required!" });
  }

  Bill.find({ branch: req.body.branch, active: true })
    .limit(1000)
    .exec((error, bills) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching bills!",
        });
      } else {
        res.json(bills);
      }
    });
};

const getBillsByCustomer = (req, res, next) => {
  if (!req.body.customer) {
    return res.status(400).json({ message: "Customer ID is required!" });
  }

  Bill.find({ customer: req.body.customer, active: true })
    .limit(1000)
    .exec((error, bills) => {
      if (error) {
        return res.status(404).json({
          message: "Error fetching bills!",
        });
      } else {
        res.json(bills);
      }
    });
};

const addBill = (req, res, next) => {
  const bill = new Bill({
    branch: req.body.branch,
    date: req.body.date,
    customer: req.body.customer,
    lrList: req.body.lrList,
    totalAmount: +req.body.totalAmount,
    dueDate: req.body.dueDate,
    serviceTax: +req.body.serviceTax,
    total: req.body.total,
    remark: req.body.remark,
    createdBy: req.body.createdBy,
  });

  Bill.findOne({}, {}, { sort: { createdAt: -1 } }, function (err, foundBill) {
    if (foundBill) {
      bill.billNo = foundBill.billNo + 1;
    } else {
      bill.billNo = 1;
    }
    Bill.create(bill, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        const allLR = req.body.lrList.map((lr) => lr._id);
        LorryReceipt.updateMany(
          { _id: { $in: allLR } },
          {
            $set: {
              billGenerated: true,
              assoBill: data._id,
              updatedBy: req.body.createdBy,
            },
          },
          { multi: true },
          (error, updatedLR) => {
            if (!error) {
              res.send(data);
            } else {
              res.send(error);
            }
          }
        );
      }
    });
  });
};

const removeBill = (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Bill ID is required!" });
  }

  Bill.findById(req.params.id, (err, foundBill) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    } else {
      const allLR = foundBill.lrList.map((lr) => lr._id);

      Bill.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            active: false,
            updatedBy: req.body.updatedBy,
          },
        },
        { new: true },
        (billError, updatedBill) => {
          if (billError) {
            return res.status(400).json({ message: billError.message });
          } else {
            LorryReceipt.updateMany(
              { _id: { $in: allLR } },
              {
                $set: {
                  billGenerated: false,
                  assoBill: "",
                  updatedBy: req.body.updatedBy,
                },
              },
              { multi: true },
              (lrError, updatedLR) => {
                if (!lrError) {
                  res.status(200).json({ id: updatedBill._id });
                } else {
                  res.send(lrError);
                }
              }
            );
          }
        }
      );
    }
  });
};

const getBill = (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Bill ID is required!" });
  }
  Bill.findById(req.params.id, (error, data) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    res.send(data);
  });
};

const updateBill = (req, res, next) => {
  const _id = req.body._id;

  if (!req.params.id || !_id) {
    return res.status(500).json({ message: "Bill ID is required!" });
  }

  Bill.findById(req.params.id, (err, foundBill) => {
    if (foundBill) {
      const allLR = foundBill.lrList.map((lr) => lr._id);
      LorryReceipt.updateMany(
        { _id: { $in: allLR } },
        {
          $set: {
            billGenerated: false,
            assoBill: "",
            updatedBy: req.body.updatedBy,
          },
        },
        { multi: true },
        (lrError, updatedLR) => {
          if (!lrError) {
            Bill.findByIdAndUpdate(
              _id,
              {
                $set: {
                  branch: req.body.branch,
                  date: req.body.date,
                  customer: req.body.customer,
                  lrList: req.body.lrList,
                  totalAmount: +req.body.totalAmount,
                  dueDate: req.body.dueDate,
                  serviceTax: +req.body.serviceTax,
                  total: req.body.total,
                  remark: req.body.remark,
                  updatedBy: req.body.updatedBy,
                },
              },
              { new: true },
              (error, data) => {
                if (error) {
                  res.status(500).json({ message: error.message });
                } else {
                  const updatedLR = req.body.lrList.map((lr) => lr._id);
                  LorryReceipt.updateMany(
                    { _id: { $in: updatedLR } },
                    {
                      $set: {
                        billGenerated: true,
                        assoBill: _id,
                        updatedBy: req.body.updatedBy,
                      },
                    },
                    { multi: true },
                    (updatedLRError, updatedBilledLR) => {
                      if (!updatedLRError) {
                        res.send(data);
                      } else {
                        res.send(updatedLRError);
                      }
                    }
                  );
                }
              }
            );
          } else {
            res.send(lrError);
          }
        }
      );
    }
  });
};

const updateBills = (req, res, next) => {
  if (req.body.bills.length <= 0) {
    return res.status(401).json({ message: "Bills are required!" });
  }

  let updatedBills = [];
  req.body.bills.forEach(async (bill) => {
    try {
      const billToBeUpdated = await Bill.findOne({ _id: bill._id });
      billToBeUpdated.paymentCollection.push(bill.payment);

      let savedBill = await billToBeUpdated.save();
      if (savedBill) {
        updatedBills.push(savedBill);
        savedBill = null;
        if (updatedBills.length === req.body.bills.length) {
          return res.send(updatedBills);
        }
      }
    } catch (e) {
      return res.status(401).json({ message: e.message });
    }
  });
};

const getLastLR = (req, res, next) => {
  LorryReceipt.find({})
    .sort({ _id: -1 })
    .limit(1)
    .exec(function (err, lr) {
      if (err) {
        res.status(401).json({ message: err.message });
      }
      if (lr.length) {
        return res.send(lr[0]);
      } else {
        return res.send({ lastLR: null });
      }
    });
};

const getLoadingSlipsBySupplier = (req, res, next) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Supplier ID is required" });
  }

  Vehicle.find({ owner: req.params.id }, (vehicleErr, vehicleData) => {
    if (vehicleErr) {
      return res.status(401).json({ message: vehicleErr.message });
    }
    if (vehicleData.length) {
      const vehicleNos = vehicleData.map(({ vehicleNo }) => vehicleNo);
      LoadingSlip.find(
        {
          vehicleNo: {
            $in: vehicleNos,
          },
        },
        (LSErr, LSData) => {
          if (LSErr) {
            return res.status(401).json({ message: LSErr.message });
          }
          res.send(LSData);
        }
      );
    } else {
      res.send([]);
    }
  });
};

const saveSupplierPayments = (req, res, next) => {
  if (req.body.loadingSlips.length <= 0) {
    return res.status(401).json({ message: "Loading slips are required!" });
  }

  let updatedLs = [];
  req.body.loadingSlips.forEach(async (ls) => {
    try {
      const LSToBeUpdated = await LoadingSlip.findOne({ _id: ls.ls_id });
      LSToBeUpdated.supplierPayments.push({
        date: ls.date,
        paid: ls.paid,
        createdBy: ls.createdBy,
      });
      let savedLs = await LSToBeUpdated.save();
      if (savedLs) {
        updatedLs.push(savedLs);
        savedLs = null;
        if (updatedLs.length === req.body.loadingSlips.length) {
          return res.send(updatedLs);
        }
      }
    } catch (e) {
      return res.status(401).json({ message: e.message });
    }
  });
};

const saveSupplierBill = (req, res, next) => {
  const bill = new SuppliersBill({
    branch: req.body.branch,
    supplier: req.body.supplier,
    date: req.body.date,
    invoiceDate: req.body.invoiceDate,
    invoiceNo: req.body.invoiceNo,
    quantity: req.body.quantity,
    supplyName: req.body.supplyName,
    amount: req.body.amount,
    createdBy: req.body.createdBy,
  });

  SuppliersBill.create(bill, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
};

const getSupplierBills = (req, res, next) => {
  if (!req.params.supplier) {
    return res.status(400).json({ message: "Supplier ID is required!" });
  }
  SuppliersBill.find({ supplier: req.params.supplier }, (err, data) => {
    if (err) {
      res.status(401).json({ message: err.message });
    }
    res.send(data);
  });
};

const updateSupplierBills = (req, res, next) => {
  if (req.body.supplierBills.length <= 0) {
    return res.status(401).json({ message: "Supplier bills are required!" });
  }

  const updatedBills = [];
  req.body.supplierBills.forEach(async (bill) => {
    try {
      const billsToBeUpdated = await SuppliersBill.findOne({ _id: bill._id });
      billsToBeUpdated.payments.push({
        date: bill.date,
        paid: bill.paid,
        createdBy: bill.createdBy,
      });
      let savedBill = await billsToBeUpdated.save();
      if (savedBill) {
        updatedBills.push(savedBill);
        savedBill = null;
        if (updatedBills.length === req.body.supplierBills.length) {
          return res.send(updatedBills);
        }
      }
    } catch (e) {
      return res.status(401).json({ message: e.message });
    }
  });
};

const updateLorryReceiptAckByLRNo = (req, res, next) => {
  if (!req.body.lrNo || req.noLrNo) {
    return res.status(404).json({ message: "Lorry receipt no is required!" });
  }

  if (req.alreadyExist) {
    return res
      .status(404)
      .json({ message: `POD file for ${req.body.lrNo} already exist!` });
  }

  if (req.lrNotExist) {
    return res
      .status(404)
      .json({ message: `${req.body.lrNo} does not exist!` });
  }

  if (!req.file) {
    return res.status(404).json({ message: "POD file is required!" });
  }
  let filePath = "";
  if (req.file) {
    const url = "http://" + req.get("host") + "/acknowledgement/";
    filePath = url + req.file.filename;
  }

  LorryReceipt.findOneAndUpdate(
    { wayBillNo: req.body.lrNo },
    {
      $set: {
        ack: filePath,
        updatedBy: req.body.updatedBy,
      },
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.json(data);
      }
    }
  );
};

const addPaymentAdvice = (req, res) => {
  if (!req.body.lorryReceipts || req.body.lorryReceipts <= 0) {
    return res.status(404).json({ message: "Lorry receipts are required!" });
  }
  let updatedLR = [];
  req.body.lorryReceipts.forEach(async (lr) => {
    try {
      const LRToBeUpdated = await LorryReceipt.findOne({ _id: lr._id });
      LRToBeUpdated.paymentAdvice.push({
        description: lr.adviceDescription,
        amount: lr.amount,
        addedOn: new Date(),
      });
      let savedLR = await LRToBeUpdated.save();
      if (savedLR) {
        updatedLR.push(savedLR);
        savedLR = null;
        if (updatedLR.length === req.body.lorryReceipts.length) {
          return res.send(updatedLR);
        }
      }
    } catch (e) {
      return res.status(401).json({ message: e.message });
    }
  });
};

const getPaymentReceipts = (req, res) => {
  PaymentReceipt.find({ active: true })
    .sort("-createdAt")
    .exec((err, data) => {
      if (err) {
        return res.status(401).json({ message: err.message });
      }
      res.send(data);
    });
};

const getPaymentReceipt = (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Payment advice id is required" });
  }
  PaymentReceipt.findById(req.params.id, (err, data) => {
    if (err) {
      return res.status(400).json(err);
    }
    return res.send(data);
  });
};

const addPaymentReceipt = (req, res) => {
  const paymentReceipt = new PaymentReceipt({
    date: req.body.date,
    diesel: req.body.diesel,
    cash: req.body.cash,
    hamali: req.body.hamali,
    tollCharges: req.body.tollCharges,
    containmentCharges: req.body.containmentCharges,
    autoCharges: req.body.autoCharges,
    otherCharges: req.body.otherCharges,
    amount: req.body.amount,
    lrList: req.body.lrList,
    remark: req.body.remark,
    createdBy: req.body.createdBy,
  });
  PaymentReceipt.findOne(
    {},
    {},
    { sort: { createdAt: -1 } },
    function (err, foundPR) {
      if (foundPR) {
        paymentReceipt.prNo = foundPR.prNo + 1;
      } else {
        paymentReceipt.prNo = 1;
      }
      PaymentReceipt.create(paymentReceipt, (error, data) => {
        if (error) {
          return res.status(401).json(error);
        } else {
          LorryReceipt.updateMany(
            { _id: { $in: paymentReceipt.lrList } },
            {
              $set: {
                paymentReceiptGenerated: true,
                associatedPR: data._id,
                updatedBy: req.body.createdBy,
              },
            },
            { multi: true },
            (updateError, updatedLR) => {
              if (updateError) {
                return res.status(401).json(updateError);
              } else {
                return res.send(data);
              }
            }
          );
        }
      });
    }
  );
};

const updatedPaymentReceipt = (req, res) => {
  PaymentReceipt.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        date: req.body.date,
        diesel: req.body.diesel,
        cash: req.body.cash,
        hamali: req.body.hamali,
        tollCharges: req.body.tollCharges,
        containmentCharges: req.body.containmentCharges,
        autoCharges: req.body.autoCharges,
        otherCharges: req.body.otherCharges,
        amount: req.body.amount,
        lrList: req.body.lrList,
        remark: req.body.remark,
        updatedBy: req.body.updatedBy,
      },
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        LorryReceipt.updateMany(
          { associatedPR: req.body._id },
          {
            $set: {
              paymentReceiptGenerated: false,
              associatedPR: "",
              updatedBy: req.body.updatedBy,
            },
          },
          { multi: true },
          (error, removedAssciationData) => {
            if (!error) {
              const allLR = req.body.lrList.map((lr) => lr._id);
              LorryReceipt.updateMany(
                { _id: { $in: allLR } },
                {
                  $set: {
                    paymentReceiptGenerated: true,
                    associatedPR: req.body._id,
                    updatedBy: req.body.updatedBy,
                  },
                },
                { multi: true },
                (error, updatedLR) => {
                  if (!error) {
                    res.send(data);
                  } else {
                    res.send(error);
                  }
                }
              );
            } else {
              res.send(error);
            }
          }
        );
      }
    }
  );
};

const deletePaymentReceipt = (req, res) => {
  PaymentReceipt.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        active: false,
      },
    },
    { new: true },
    (error, data) => {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.send(data);
      }
    }
  );
};

const getLRForPaymentReceipt = (req, res) => {
  LorryReceipt.find(
    { paymentReceiptGenerated: false, active: true },
    (err, data) => {
      if (err) {
        res.status(401).json({ message: err.message });
      }
      res.send(data);
    }
  );
};

const getLRForPaymentReceiptById = (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({ message: "Payment receipt id is required" });
  }
  LorryReceipt.find(
    {
      $or: [
        { associatedPR: req.params.id, active: true },
        { paymentReceiptGenerated: false, active: true },
      ],
    },
    (err, data) => {
      if (err) {
        return res.status(401).json({ message: err.message });
      }
      res.send(data);
    }
  );
};

const getLastPaymentReceiptNo = (req, res) => {
  let prNo;
  PaymentReceipt.findOne(
    {},
    {},
    { sort: { createdAt: -1 } },
    function (err, foundPR) {
      if (foundPR) {
        prNo = foundPR.prNo + 1;
      } else {
        prNo = 1;
      }
      res.send({ prNo: prNo });
    }
  );
};

const downloadPaymentReceipt = (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Invalid request" });
  }
  let PRData;
  let lorryReceipts;

  PaymentReceipt.findById(req.params.id, (error, data) => {
    if (error) {
      res.json({ message: error.message });
    } else {
      PRData = JSON.parse(JSON.stringify(data));
      PRData.date = getFormattedDate(data.date);
      LorryReceipt.find(
        {
          _id: { $in: PRData.lrList },
        },
        (error, lorryReceipts) => {
          if (error) {
            res.send(error);
          }
          lorryReceipts = JSON.parse(JSON.stringify(lorryReceipts));
          if (lorryReceipts.length) {
            lorryReceipts.forEach((lr) => {
              lr.totalArticles = 0;
              lr.transactions.forEach((tr) => {
                lr.totalArticles =
                  lr.totalArticles +
                  tr.boxQuantity +
                  tr.popQuantity +
                  tr.looseQuantity;
              });
            });
          }
          const vehiclesList = lorryReceipts.map((lr) => lr.vehicleNo);
          const fromList = lorryReceipts.map((lr) => lr.from);
          const toList = lorryReceipts.map((lr) => lr.to);
          const vehicles = [...new Set(vehiclesList)];
          const from = [...new Set(fromList)];
          const to = [...new Set(toList)];
          const fromString = from.toString();
          const toString = to.toString();
          const vehicleNos = vehicles.toString();
          lorryReceipts.forEach((lr) => {
            lr.formattedLr = getFormattedLRNo(pad(lr.lrNo, 6));
          });
          PRData.diesel = PRData.diesel.toFixed(2);
          PRData.cash = PRData.cash.toFixed(2);
          PRData.hamali = PRData.hamali.toFixed(2);
          PRData.tollCharges = PRData.tollCharges.toFixed(2);
          PRData.containmentCharges = PRData.containmentCharges.toFixed(2);
          PRData.autoCharges = PRData.autoCharges.toFixed(2);
          PRData.otherCharges = PRData.otherCharges.toFixed(2);
          PRData.amount = PRData.amount.toFixed(2);
          const templatePath =
            path.join(__dirname, "../bills/") + "Payment-Receipt.html";
          res.render(
            templatePath,
            {
              info: {
                pr: PRData,
                prNo: getFormattedPRNo(pad(PRData.prNo, 6)),
                vehicleNo: vehicleNos,
                lr: lorryReceipts,
                from: from,
                to: to,
              },
            },
            (err, HTML) => {
              const finalPath = path.join(__dirname, "../payment-receipts/");
              const fileName = getFormattedPRNo(pad(PRData.prNo, 6));
              pdf
                .create(HTML, options)
                .toFile(
                  path.join(finalPath, fileName + ".pdf"),
                  (err, result) => {
                    if (err) {
                      return res.status(400).send({
                        message: err,
                      });
                    }
                    return res.sendFile(result.filename);
                  }
                );
            }
          );
        }
      );
    }
  });
};

const downloadMISReport = async (req, res) => {
  const { fromDate, toDate } = req.body;
  if (!fromDate || !toDate) {
    return res.status(400).json({ message: "Start or end date is missing" });
  }
  // const startDate = new Date(fromDate);
  // const formattedStartDate = startDate.setHours(0, 0, 0, 0);
  // const endDate = new Date(toDate);
  // const formattedEndDate = endDate.setHours(23, 59, 59, 999);
  // const start = new Date(formattedStartDate);
  // const end = new Date(formattedEndDate);

  try {
    const lorryReceipts = await LorryReceipt.find({
      date: {
        $gte: fromDate,
        $lt: toDate,
      },
      active: true,
    });
    const formattedLR = [];
    lorryReceipts.forEach((lr) => {
      lr.transactions.forEach((tr, index) => {
        formattedLR.push({
          index: index + 1,
          date: getFormattedDate(lr.date),
          consignee: lr.consignee,
          to: lr.to.toUpperCase(),
          lrNo: `PUN-${lr.lrNo.toString().padStart(6, "0")}`,
          invoiceNo: tr.invoiceNo,
          quantity: +tr.boxQuantity + +tr.popQuantity,
          piece: +tr.loosePiece + +tr.looseQuantity,
          vehicleNo: lr.vehicleNo,
          "u-date": lr.ack ? lr.updatedAt : '',
          yesNo: lr.yesNo.toUpperCase(),
          remark: lr.remark,
        });
      });
    });
    console.log(formattedLR);
    // return res.send({
    //   formattedLR,
    //   lorryReceipts,
    // });
    const workbook = exportLRDataToXlsx(formattedLR);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=" + "data.xlsx");
    return workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  } catch (e) {
    return res.status(400).json(e);
  }
};

module.exports = {
  updateLorryReceiptDateRange,
  getLorryReceipts,
  getLorryReceiptsWithCount,
  getAllLorryReceiptsWithCount,
  getLorryReceiptsByConsignor,
  addLorryReceipt,
  removeLorryReceipt,
  viewLorryReceipt,
  getLorryReceipt,
  updateLorryReceipt,
  updateLorryReceiptAck,
  removeLorryReceiptAck,
  getLoadingSlips,
  addLoadingSlip,
  removeLoadingSlip,
  getLoadingSlip,
  updateLoadingSlip,
  getMoneyTransfers,
  addMoneyTransfer,
  removeMoneyTransfer,
  updateMoneyTransfer,
  getMoneyTransfer,
  getPettyTransactions,
  addPettyTransaction,
  getPettyCashBalance,
  getPettyTransactionsByDate,
  getLoadingSlipsById,
  getLorryReceiptsByDate,
  getBills,
  getBillsByCustomer,
  addBill,
  removeBill,
  getBill,
  updateBill,
  updateBills,
  getLastLR,
  getLoadingSlipsBySupplier,
  saveSupplierPayments,
  saveSupplierBill,
  getSupplierBills,
  updateSupplierBills,
  updateLorryReceiptAckByLRNo,
  addPaymentAdvice,
  getPaymentReceipts,
  getPaymentReceipt,
  getLRForPaymentReceipt,
  getLRForPaymentReceiptById,
  addPaymentReceipt,
  updatedPaymentReceipt,
  getLastPaymentReceiptNo,
  downloadPaymentReceipt,
  getAllLorryReceiptsWithCountDateRange,
  getLorryReceiptsWithCountDateRange,
  deletePaymentReceipt,
  downloadMISReport,
};

const getFormattedDate = (date) => {
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear();
  return `${day}-${month}-${year}`;
};

// prefix 0 to a number
const pad = (num, size) => {
  if (typeof num === "number" && typeof size === "number") {
    let stringNum = num.toString();
    while (stringNum.length < size) stringNum = "0" + stringNum;
    return stringNum;
  }
  return false;
};

const getFormattedLRNo = (num) => {
  return "P1-" + num;
};
const getFormattedPRNo = (num) => {
  return "PR-" + num;
};

function exportLRDataToXlsx(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Lorry receipts");
  const columns = data.reduce(
    (acc, obj) => (acc = Object.getOwnPropertyNames(obj)),
    []
  );
  worksheet.columns = [
    { header: "SR. NO.", key: "index" },
    { header: "DATE", key: "date" },
    { header: "RD. NAME", key: "consignee" },
    { header: "DESTINATION", key: "to" },
    { header: "LR. NO.", key: "lrNo" },
    { header: "INV. NO.", key: "invoiceNo" },
    { header: "QTY", key: "quantity" },
    { header: "PCS", key: "piece" },
    { header: "VEH. NO.", key: "vehicleNo" },
    { header: "Updated Date", key: "u-date" },
    { header: "YES / NO", key: "yesNo" },
    { header: "REMARK", key: "remark" },
  ];

  worksheet.addRows(data);
  return workbook;
}
