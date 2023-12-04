const express = require("express");
const routes = express.Router();
const path = require("path");
const multer = require("multer");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const transactionsCtrl = require("../controller/transactions-controller");
const LorryReceipt = require("../models/LorryReceipt");

const ackStorage = multer.diskStorage({
  // Destination to store image
  destination: "acknowledgement",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const ackUpload = multer({
  storage: ackStorage,
  limits: {
    fileSize: 10000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a valid image type (png/jpg/jpeg)"));
    }
    cb(undefined, true);
  },
});

const ackByLRUpload = multer({
  storage: ackStorage,
  limits: {
    fileSize: 10000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    if (!req.body.lrNo) {
      req.noLrNo = true;
      return cb(new Error("Lorry receipt no is required!!!"));
    }
    LorryReceipt.find({ wayBillNo: req.body.lrNo }, (err, lrData) => {
      if (err) {
        return cb(new Error(err.message));
      }
      if (!lrData || lrData.length < 1) {
        req.lrNotExist = true;
        return cb(undefined, false);
        //return cb(new Error(`Lorry receipt ${req.body.lrNo} not found`));
      }
      if (lrData && lrData.length) {
        if (lrData[0].ack) {
          req.alreadyExist = true;
          return cb(undefined, false);
        }
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
          // upload only png and jpg format
          return cb(
            new Error("Please upload a valid image type (png/jpg/jpeg)")
          );
        }
        if (!req.alreadyExist) {
          cb(undefined, true);
        }
      }
    });
  },
});

// Get all lorry receipts by branch (100 receipts)
routes.route("/getLorryReceipts").post(transactionsCtrl.getLorryReceipts);

// Get all lorry receipts with count by branch (1000 receipts)
routes
  .route("/getLorryReceiptsWithCount")
  .post(transactionsCtrl.getLorryReceiptsWithCount);

// Get all lorry receipts with count by branch (1000 receipts)
routes
  .route("/getAllLorryReceiptsWithCountDateRange")
  .post(transactionsCtrl.getAllLorryReceiptsWithCountDateRange);

routes
  .route("/getLorryReceiptsWithCountDateRange")
  .post(transactionsCtrl.getLorryReceiptsWithCountDateRange);

routes
  .route("/updateLorryReceiptDateRange")
  .post(transactionsCtrl.updateLorryReceiptDateRange);

// Get all lorry receipts with count (1000 receipts)
routes
  .route("/getAllLorryReceiptsWithCount")
  .post(transactionsCtrl.getAllLorryReceiptsWithCount);

// Get all lorry receipts by branch and consignor (100 receipts)
routes
  .route("/getLorryReceiptsByConsignor")
  .post(transactionsCtrl.getLorryReceiptsByConsignor);

//Add a lorry receipt
routes.route("/addLorryReceipt").post(transactionsCtrl.addLorryReceipt);

//Delete a lorry receipt
routes
  .route("/removeLorryReceipt/:id")
  .delete(transactionsCtrl.removeLorryReceipt);

// Get all lorry receipts by search dates
routes
  .route("/getLorryReceiptsByDate")
  .post(transactionsCtrl.getLorryReceiptsByDate);

//View bill
routes.route("/viewLorryReceipt/:id").get(transactionsCtrl.viewLorryReceipt);

//Get a lorry receipt by id
routes.route("/getLorryReceipt/:id").get(transactionsCtrl.getLorryReceipt);

//Update a lorry receipt
routes
  .route("/updateLorryReceipt/:id")
  .put(transactionsCtrl.updateLorryReceipt);

//Update a lorry receipt acknowledgement
routes
  .route("/updateLorryReceiptAck/:id")
  .put(ackUpload.single("ack"), transactionsCtrl.updateLorryReceiptAck);

routes
  .route("/removeLorryReceiptAck/:id")
  .post(transactionsCtrl.removeLorryReceiptAck);

// Get all loading slips by branch (100 receipts)
routes.route("/getLoadingSlips").post(transactionsCtrl.getLoadingSlips);

// Get loading slips by Id
routes.route("/getLoadingSlipsById").post(transactionsCtrl.getLoadingSlipsById);

//Add a loading slip
routes.route("/addLoadingSlip").post(transactionsCtrl.addLoadingSlip);

//Delete a loading slip
routes
  .route("/removeLoadingSlip/:id")
  .delete(transactionsCtrl.removeLoadingSlip);

//Get a loading slip by id
routes.route("/getLoadingslip/:id").get(transactionsCtrl.getLoadingSlip);

//Update a loading slip
routes.route("/updateLoadingSlip/:id").put(transactionsCtrl.updateLoadingSlip);

// Get all money trasfers by branch (100 transfers)
routes.route("/getMoneyTransfers").post(transactionsCtrl.getMoneyTransfers);

//Add a money transfer
routes.route("/addMoneyTransfer").post(transactionsCtrl.addMoneyTransfer);

//Delete a money transfer
routes
  .route("/removeMoneyTransfer/:id")
  .delete(transactionsCtrl.removeMoneyTransfer);

//Update a money transfer
routes
  .route("/updateMoneyTransfer/:id")
  .put(transactionsCtrl.updateMoneyTransfer);

//Get a money transfer by id
routes.route("/getMoneyTransfer/:id").get(transactionsCtrl.getMoneyTransfer);

// Get all petty cash transactions by branch (100 transfers)
routes
  .route("/getPettyTransactions")
  .post(transactionsCtrl.getPettyTransactions);

//Add a petty transaction
routes.route("/addPettyTransaction").post(transactionsCtrl.addPettyTransaction);

//Get petty cash balance
routes.route("/getPettyCashBalance").get(transactionsCtrl.getPettyCashBalance);

// Get transactions by start and end dates
routes
  .route("/getPettyTransactionsByDate")
  .post(transactionsCtrl.getPettyTransactionsByDate);

// Get bills by branch (100 bills)
routes.route("/getBills").post(transactionsCtrl.getBills);

// Get bills by customer (100 bills)
routes.route("/getBillsByCustomer").post(transactionsCtrl.getBillsByCustomer);

// Add a bill
routes.route("/addBill").post(transactionsCtrl.addBill);

//Remove a bill
routes.route("/removeBill/:id").delete(transactionsCtrl.removeBill);

//Get a bill by id
routes.route("/getBill/:id").get(transactionsCtrl.getBill);

//Update a bill
routes.route("/updateBill/:id").put(transactionsCtrl.updateBill);

//Update multiple bills for payment collection
routes.route("/updateBills").post(transactionsCtrl.updateBills);

routes.route("/getLastLR").get(transactionsCtrl.getLastLR);

routes
  .route("/getLoadingSlipsBySupplier/:id")
  .get(transactionsCtrl.getLoadingSlipsBySupplier);

routes
  .route("/saveSupplierPayments")
  .post(transactionsCtrl.saveSupplierPayments);

routes.route("/saveSupplierBill").post(transactionsCtrl.saveSupplierBill);

routes
  .route("/getSupplierBills/:supplier")
  .get(transactionsCtrl.getSupplierBills);

routes.route("/updateSupplierBills").post(transactionsCtrl.updateSupplierBills);

routes
  .route("/updateLorryReceiptAckByLRNo")
  .post(
    ackByLRUpload.single("ack"),
    transactionsCtrl.updateLorryReceiptAckByLRNo
  );

routes.route("/addPaymentAdvice").post(transactionsCtrl.addPaymentAdvice);

routes.route("/getPaymentReceipts").get(transactionsCtrl.getPaymentReceipts);

routes.route("/getPaymentReceipt/:id").get(transactionsCtrl.getPaymentReceipt);

routes.route("/addPaymentReceipt").post(transactionsCtrl.addPaymentReceipt);

routes
  .route("/updatedPaymentReceipt")
  .post(transactionsCtrl.updatedPaymentReceipt);

routes
  .route("/deletePaymentReceipt")
  .post(transactionsCtrl.deletePaymentReceipt);

routes
  .route("/getLRForPaymentReceipt")
  .get(transactionsCtrl.getLRForPaymentReceipt);

routes
  .route("/getLRForPaymentReceiptById/:id")
  .get(transactionsCtrl.getLRForPaymentReceiptById);

routes
  .route("/getLastPaymentReceiptNo")
  .get(transactionsCtrl.getLastPaymentReceiptNo);

routes
  .route("/downloadPaymentReceipt/:id")
  .get(transactionsCtrl.downloadPaymentReceipt);

routes.route("/downloadMISReport").post(transactionsCtrl.downloadMISReport);

module.exports = routes;
