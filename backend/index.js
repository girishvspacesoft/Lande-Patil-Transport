const express = require("express"),
  path = require("path"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  dbConfig = require("./database/db"),
  engines = require("consolidate");

// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database sucessfully connected");
    },
    (error) => {
      console.log("Database could not connected: " + error);
    }
  );

const userRoutes = require("./routes/user-routes");
const masterRoutes = require("./routes/master-routes");
const transactionsRoutes = require("./routes/transactions-routes");
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());
app.use("/public", express.static("public"));
app.use("/acknowledgement", express.static("acknowledgement"));
app.use("/bills", express.static("bills"));
app.use("/payment-receipts", express.static("payment-receipts"));
app.use("/api/user/", userRoutes);
app.use("/api/master/", masterRoutes);
app.use("/api/transactions/", transactionsRoutes);

app.engine("html", engines.mustache);
app.set("view engine", "html");

// Create port
const port = process.env.PORT || 4200;
const server = app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Connected to port ${port}`);
  }
});

//Find 404 and hand over to error handler
app.use((req, res, next) => {
  next({ code: 404, message: "error" });
});
