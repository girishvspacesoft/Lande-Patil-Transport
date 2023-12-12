import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
  Button,
  Paper,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Select from "@mui/material/Select";
import { Alert, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { getDataForLR } from "../../../lib/api-master";
import {
  updateLorryReceipt,
  getLorryReceipt,
  viewLorryReceipt,
} from "../../../lib/api-transactions";
import LoadingSpinner from "../../UI/LoadingSpinner";
import TransactionDetails from "./Transaction-Details/TransactionDetails";
import { getFormattedLRNumber, isValidDate } from "../../../lib/helper";
import { BILLS_PATH } from "../../../lib/api-base-paths";

const initialState = {
  isBlank: false,
  type: "return",
  driverName: "",
  branch: "",
  wayBillNo: "",
  date: new Date(),
  vehicleNo: "",
  vehicleType: "",
  consignor: "",
  consignorGst: "",
  consignorAddress: "",
  consignorFrom: "",
  consignee: "",
  consigneeGst: "",
  consigneeAddress: "",
  consigneeTo: "",
  transactions: [],
  serviceType: "LTT",
  remark: "",
  mobile: ""
};

const initialErrorState = {
  branch: {
    invalid: false,
    message: "",
  },
  date: {
    invalid: false,
    message: "",
  },
  vehicleNo: {
    invalid: false,
    message: "",
  },
  mobile: {
    invalid: false,
    message: "",
  },
  driverName: {
    invalid: false,
    message: "",
  },
  vehicleType: {
    invalid: false,
    message: "",
  },
  consignor: {
    invalid: false,
    message: "",
  },
  consignorFrom: {
    invalid: false,
    message: "",
  },
  consignee: {
    invalid: false,
    message: "",
  },
  consigneeTo: {
    invalid: false,
    message: "",
  },
  materialCost: {
    invalid: false,
    message: "",
  },
  deliveryInDays: {
    invalid: false,
    message: "",
  },
  transactionDetails: {
    invalid: false,
    message: "",
  },
};

const LorryReceiptEdit = () => {
  const [branches, setBranches] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [lorryReceipt, setLorryReceipt] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState("");
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [isPrint, setPrint] = useState(false);
  const [isDownload, setDownload] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { lrId } = location.state;
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    getDataForLR(controller)
      .then((response) => {
        setIsLoading(false);
        if (response.length && response.length === 7) {
          setBranches(response[0]);
          const updatedCustomers = response[3].map((customer) => {
            customer.label = customer.name;
            customer.value = customer.name;
            return customer;
          });
          setCustomers(updatedCustomers);
          const updatedVehicles = response[1].map((vehicle) => {
            vehicle.label = vehicle.vehicleNo;
            vehicle.value = vehicle.vehicleNo;
            return vehicle;
          });
          setVehicles(updatedVehicles);
          const updatedPlaces = response[4].map((place) => {
            place.label = place.name;
            place.value = place.name;
            return place;
          });
          const vehicleTypes = response[5].map((type) => {
            type.label = type.type;
            type.value = type.type;
            return type;
          });
          setVehicleTypes(vehicleTypes);
          setPlaces(updatedPlaces);
        } else {
          setHttpError(
            "Something went wrong! Please try later or contact Administrator."
          );
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setHttpError(
          "Something went wrong! Please try later or contact Administrator."
        );
      });
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (lrId && lrId !== "" && customers.length) {
      setIsLoading(true);
      getLorryReceipt(lrId, controller)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError("");
            const updatedResponse = { ...response };
            let consignor = null;
            let consignee = null;
            const consignorIndex = customers.findIndex(
              (customer) =>
                response.consignor &&
                customer.name.toUpperCase() === response.consignor.toUpperCase()
            );
            if (consignorIndex > -1) {
              consignor = customers[consignorIndex];
            }
            const consigneeIndex = customers.findIndex(
              (customer) =>
                response.consignee &&
                customer.name.toUpperCase() === response.consignee.toUpperCase()
            );
            if (consigneeIndex > -1) {
              consignee = customers[consigneeIndex];
            }
           
            updatedResponse.consignor = consignor;
            updatedResponse.consignorGst = consignor?.gstNo || "";
            updatedResponse.consignorAddress = consignor?.address || "";
            updatedResponse.consignorFrom = consignor?.city || "";
            updatedResponse.consignee = consignee;
            updatedResponse.consigneeGst = consignee?.gstNo || "";
            updatedResponse.consigneeAddress = consignee?.address || "";
            updatedResponse.consigneeTo = consignee?.city || "";
            
            updatedResponse.date = new Date(updatedResponse.date);
            setLorryReceipt(updatedResponse);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setHttpError(error.message);
        });
    }

    return () => {
      controller.abort();
    };
  }, [lrId, customers, places, vehicles]);

  const goToLorryReceipts = useCallback(() => {
    navigate("/transactions/returnLorryReceiptList");
  }, [navigate]);

  const downloadFile = useCallback(
    (blob, fileName, selectedLR) => {
      
      const baseURL =
        BILLS_PATH + getFormattedLRNumber(selectedLR.lrNo) + ".pdf";
      fetch(baseURL)
        .then((res) => res.blob())
        .then((file) => {
          let tempUrl = URL.createObjectURL(file);
          const aTag = document.createElement("a");
          aTag.href = tempUrl;
          aTag.download = baseURL.replace(/^.*[\\/]/, "");
          document.body.appendChild(aTag);
          aTag.click();
          URL.revokeObjectURL(tempUrl);
          aTag.remove();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    []
  );
  useEffect(() => {
    const controller = new AbortController();
    if (hasErrors) {
      setPrint(false);
      
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      const updatedLR = JSON.parse(JSON.stringify(lorryReceipt));      
      updatedLR.consignor = updatedLR.consignor.value
        ? updatedLR.consignor.value
        : updatedLR.consignor;
      updatedLR.consignee = updatedLR.consignee.value
        ? updatedLR.consignee.value
        : updatedLR.consignee;

      setIsLoading(true);
      updateLorryReceipt(updatedLR, controller)
        .then((response) => {
          if (response.message) {
            setIsLoading(false);
            setHttpError(response.message);
          } else {
            setHttpError("");
            if(isPrint)  {
              const controllerView = new AbortController();
              
              viewLorryReceipt(response._id, controllerView)
              .then((responseView) => {
                if (responseView.message) {
                  setHttpError(responseView.message);
                } else {
                    const selectedLR = response;                  
                    const path =
                      BILLS_PATH + getFormattedLRNumber(selectedLR.lrNo) + ".pdf";
                    window.open(path, "_blank");
                  
                }
                setIsLoading(false);
                setPrint(false);
                goToLorryReceipts();
                controllerView.abort();
              })
              .catch((error) => {
                setHttpError(error.message);
                setIsLoading(false);
                setPrint(false);
                controllerView.abort();
              });
              
            } else {
              setFormErrors(initialErrorState);
              setLorryReceipt(initialState);
              setIsLoading(false);
              goToLorryReceipts();
            }
          }
          setIsSubmitted(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setHttpError(error.message);
        });
    }

    return () => {
      controller.abort();
    };
  }, [isSubmitted, downloadFile, isPrint, hasErrors, lorryReceipt, goToLorryReceipts]);

  const backButtonHandler = () => {
    goToLorryReceipts();
  };

  const inputChangeHandler = (e, isChecked) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "isBlank") {
      value = isChecked;
    }
    setLorryReceipt((currState) => {
      return {
        ...currState,
        [name]: value,
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors((currState) => validateForm(lorryReceipt));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.branch.trim() === "") {
      errors.branch = { invalid: true, message: "Branch is required" };
    }
    if (!formData.isBlank) {
      if (formData.date && !isValidDate(formData.date)) {
        errors.date = { invalid: true, message: "Date is invalid" };
      }
      if (formData.vehicleNo.trim() === "") {
        errors.vehicleNo = {
          invalid: true,
          message: "Vehicle number is required",
        };
      }
      if (formData.vehicleType.trim() === "") {
        errors.vehicleType = {
          invalid: true,
          message: "Vehicle type is required",
        };
      }
      if (!formData.consignor) {
        errors.consignor = { invalid: true, message: "Consignor is required" };
      }
      if (formData.consignorFrom.trim() === "") {
        errors.from = { invalid: true, message: "From is required" };
      }
      if (!formData.consignee) {
        errors.consignee = { invalid: true, message: "Consignee is required" };
      }
      if (formData.consigneeTo === "") {
        errors.to = { invalid: true, message: "To is required" };
      }
      if (!formData.transactions.length) {
        errors.transactionDetails = {
          invalid: true,
          message: "At lease one transaction is required",
        };
      }
    }

    let validationErrors = false;
    for (const key in errors) {
      if (errors[key].invalid === true) {
        validationErrors = true;
      }
    }
    if (validationErrors) {
      setHasErrors(true);
    } else {
      setHasErrors(false);
    }
    return errors;
  };

  const dateInputChangeHandler = (name, date) => {
    setLorryReceipt((currState) => {
      return {
        ...currState,
        [name]: new Date(date),
      };
    });
  };

  const consignorChangeHandler = (e, value) => {
    if (value) {
      if (typeof value === "object") {
        setLorryReceipt((currState) => {
          return {
            ...currState,
            consignor: value.label,
            consignorGst: value.gstNo,
            consignorAddress: value.address,
            consignorFrom: value.city,
          };
        });
      } else {
        setLorryReceipt((currState) => {
          return {
            ...currState,
            consignor: value,
          };
        });
      }
    } else {
      setLorryReceipt((currState) => {
        return {
          ...currState,
          consignor: "",
        };
      });
    }
  };

  const consigneeChangeHandler = (e, value) => {
    if (value) {
      if (typeof value === "object") {
        setLorryReceipt((currState) => {
          return {
            ...currState,
            consignee: value.label,
            consigneeGst: value.gstNo,
            consigneeAddress: value.address,
            consigneeTo: value.city,
          };
        });
      } else {
        setLorryReceipt((currState) => {
          return {
            ...currState,
            consignee: value,
          };
        });
      }
    } else {
      setLorryReceipt((currState) => {
        return {
          ...currState,
          consignee: "",
        };
      });
    }
  };

  const autocompleteChangeListener = (e, option, name) => {
    setLorryReceipt((currState) => {
      return {
        ...currState,
        [name]: option,
      };
    });
  };

  const vehicleChangeHandler = (e, value, name) => {
    if (typeof value === "object") {
      if (value && value.label) {
        value = value.label;
      } else {
        value = "";
      }
    }
    setLorryReceipt((currState) => {
      return {
        ...currState,
        [name]: value,
      };
    });
  };
  const submitAndPrintHandler = (e) => {
    e.preventDefault();
    setFormErrors((currState) => validateForm(lorryReceipt));
    setIsSubmitted(true);
    setPrint(true);
  }
  return (
    <>
      {isLoading && <LoadingSpinner />}
      <h1 className="pageHead">Returnable Lorry Receipt Details</h1>
      {httpError !== "" && (
        <Stack
          sx={{
            width: "100%",
            margin: "0 0 30px 0",
            border: "1px solid red",
            borderRadius: "4px",
          }}
          spacing={2}
        >
          <Alert severity="error">{httpError}</Alert>
        </Stack>
      )}
      <form action="" onSubmit={submitHandler} id="lorryReceiptForm">
        <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
          <div className="grid grid-6-col">
            {user.type.toLowerCase() === "admin" ||
            user.type.toLowerCase() === "superadmin" ? (
              <div className="grid-item">
                <FormControl
                  fullWidth
                  size="small"
                  error={formErrors.branch.invalid}
                >
                  <InputLabel id="branch">Branch</InputLabel>
                  <Select
                    labelId="branch"
                    name="branch"
                    label="Branch"
                    value={lorryReceipt.branch}
                    onChange={inputChangeHandler}
                  >
                    {branches.length > 0 &&
                      branches.map((branch) => (
                        <MenuItem
                          key={branch._id}
                          value={branch._id}
                          className="menuItem"
                        >
                          {branch.name}
                        </MenuItem>
                      ))}
                  </Select>
                  {formErrors.branch.invalid && (
                    <FormHelperText>{formErrors.branch.message}</FormHelperText>
                  )}
                </FormControl>
              </div>
            ) : null}
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  variant="outlined"
                  label="LR no."
                  value={lorryReceipt.wayBillNo}
                  onChange={inputChangeHandler}
                  name="wayBillNo"
                  id="wayBillNo"
                  inputProps={{ readOnly: true }}
                />
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth error={formErrors.date.invalid}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    inputFormat="DD/MM/YYYY"
                    value={lorryReceipt.date}
                    onChange={dateInputChangeHandler.bind(null, "date")}
                    inputProps={
                      {
                        // readOnly: true,
                        // onFocus: () => setDateFocus(currState => true),
                        // onBlur: () => setDateFocus(currState => false),
                        // onClick: (e) => setDateFocus(currState => !currState)
                      }
                    }
                    closeOnSelect
                    renderInput={(params) => (
                      <TextField name="date" size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
                {formErrors.date.invalid && (
                  <FormHelperText>{formErrors.date.message}</FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="grid-item">
              <FormControl
                fullWidth
                size="small"
                error={formErrors.vehicleNo.invalid}
              >
                <Autocomplete
                  freeSolo
                  autoSelect
                  size="small"
                  name="vehicleNo"
                  options={vehicles}
                  value={lorryReceipt.vehicleNo}
                  getOptionLabel={(option) => option.label || option}
                  // onChange={(e, value) => autocompleteChangeListener(e, value, 'vehicleNo')}
                  onChange={(e, value) =>
                    vehicleChangeHandler(e, value, "vehicleNo")
                  }
                  openOnFocus
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vehicle No"
                      error={formErrors.vehicleNo.invalid}
                      fullWidth
                    />
                  )}
                />
                {formErrors.vehicleNo.invalid && (
                  <FormHelperText>
                    {formErrors.vehicleNo.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl
                fullWidth
                size="small"
                error={formErrors.vehicleType.invalid}
              >
                <Autocomplete
                  freeSolo
                  autoSelect
                  size="small"
                  name="vehicleType"
                  options={vehicleTypes}
                  value={lorryReceipt.vehicleType}
                  getOptionLabel={(option) => option.label || option}
                  // onChange={(e, value) => autocompleteChangeListener(e, value, 'vehicleType')}
                  onChange={(e, value) =>
                    vehicleChangeHandler(e, value, "vehicleType")
                  }
                  openOnFocus
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vehicle Type"
                      error={formErrors.vehicleType.invalid}
                      fullWidth
                    />
                  )}
                />
                {formErrors.vehicleType.invalid && (
                  <FormHelperText>
                    {formErrors.vehicleType.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            {/* {user.type.toLowerCase() !== "admin" &&
            user.type.toLowerCase() !== "superadmin" ? (
              <div className="grid-item"></div>
            ) : null} */}
            <div className="grid-item">
              <FormControl fullWidth size="small" error={formErrors.driverName.invalid}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Driver Name"
                  error={formErrors.driverName.invalid}
                  value={lorryReceipt.driverName}
                  onChange={inputChangeHandler}
                  name="driverName"
                  id="driverName"
                />
                {formErrors.driverName.invalid && (
                  <FormHelperText>
                    {formErrors.driverName.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth error={formErrors.mobile.invalid}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Mobile"
                  value={lorryReceipt.mobile}
                  onChange={inputChangeHandler}
                  name="mobile"
                  id="mobile"
                />
                {formErrors.mobile.invalid && (
                  <FormHelperText>
                    {formErrors.mobile.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl
                fullWidth
                size="small"
                error={formErrors.consignor.invalid}
              >
                <Autocomplete
                  freeSolo
                  autoSelect
                  size="small"
                  name="consignor"
                  options={customers.filter(
                    (customer) => customer.type.toLowerCase() === "consignor"
                  )}
                  value={lorryReceipt.consignor}
                  onChange={(e, value) => consignorChangeHandler(e, value)}
                  openOnFocus
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Consignor"
                      error={formErrors.consignor.invalid}
                      fullWidth
                    />
                  )}
                />
                {formErrors.consignor.invalid && (
                  <FormHelperText>
                    {formErrors.consignor.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            {/* <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Consignor GST no."
                  value={lorryReceipt.consignorGst}
                  onChange={inputChangeHandler}
                  name="consignorGst"
                  id="consignorGst"
                />
              </FormControl>
            </div> */}
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Consignor address"
                  value={lorryReceipt.consignorAddress}
                  onChange={inputChangeHandler}
                  name="consignorAddress"
                  id="consignorAddress"
                />
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth error={formErrors.consignorFrom.invalid}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="From"
                  error={formErrors.consignorFrom.invalid}
                  value={lorryReceipt.consignorFrom}
                  onChange={inputChangeHandler}
                  name="consignorFrom"
                  id="consignorFrom"
                />
                {formErrors.consignorFrom.invalid && (
                  <FormHelperText>
                    {formErrors.consignorFrom.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            {/* <div className="grid-item"></div>
            <div className="grid-item"></div>
            <div className="grid-item"></div> */}
            <div className="grid-item">
              <FormControl
                fullWidth
                size="small"
                error={formErrors.consignee.invalid}
              >
                <Autocomplete
                  freeSolo
                  autoSelect
                  size="small"
                  name="consignee"
                  options={customers.filter(
                    (customer) => customer.type.toLowerCase() === "consignee"
                  )}
                  value={lorryReceipt.consignee}
                  onChange={(e, value) => consigneeChangeHandler(e, value)}
                  openOnFocus
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Consignee"
                      error={formErrors.consignee.invalid}
                      fullWidth
                    />
                  )}
                />
                {formErrors.consignee.invalid && (
                  <FormHelperText>
                    {formErrors.consignee.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            {/* <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Consignee GST no."
                  value={lorryReceipt.consigneeGst}
                  onChange={inputChangeHandler}
                  name="consigneeGst"
                  id="consigneeGst"
                />
              </FormControl>
            </div> */}
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Consignee address"
                  value={lorryReceipt.consigneeAddress}
                  onChange={inputChangeHandler}
                  name="consigneeAddress"
                  id="consigneeAddress"
                />
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth error={formErrors.consigneeTo.invalid}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="To"
                  error={formErrors.consigneeTo.invalid}
                  value={lorryReceipt.consigneeTo}
                  onChange={inputChangeHandler}
                  name="consigneeTo"
                  id="consigneeTo"
                />
                {formErrors.consigneeTo.invalid && (
                  <FormHelperText>
                    {formErrors.consigneeTo.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            {/* <div className="grid-item"></div>
            <div className="grid-item"></div>
            <div className="grid-item"></div> */}
            {/* <div className="grid-item">
              <FormControl fullWidth size="small">
                <Autocomplete
                  disablePortal
                  autoSelect
                  autoHighlight={true}
                  size="small"
                  name="serviceType"
                  options={["LTT"]}
                  value={lorryReceipt.serviceType}
                  onChange={(e, value) =>
                    autocompleteChangeListener(e, value, "serviceType")
                  }
                  openOnFocus
                  renderInput={(params) => (
                    <TextField {...params} label="Service type" fullWidth />
                  )}
                />
              </FormControl>
            </div> */}
           
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Remark"
                  value={lorryReceipt.remark}
                  onChange={inputChangeHandler}
                  name="remark"
                  id="remark"
                />
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControlLabel
                control={
                  <Checkbox
                    name="isBlank"
                    checked={lorryReceipt.isBlank}
                    onChange={inputChangeHandler}
                  />
                }
                label="Cancel LR"
              />
            </div>
           
          </div>
        </Paper>
      </form>
      <h2 className="mb20">Transactions details</h2>
      {formErrors.transactionDetails.invalid && (
        <p className="error">{formErrors.transactionDetails.message}</p>
      )}
      <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
        <TransactionDetails
          lorryReceipt={lorryReceipt}
          setLorryReceipt={setLorryReceipt}
        />
      </Paper>

      <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
        <div className="right">
          <Button variant="outlined" size="medium" onClick={backButtonHandler}>
            Back
          </Button>
          <Button
            variant="contained"
            size="medium"
            type="submit"
            color="primary"
            form="lorryReceiptForm"
            className="ml6"
          >
            Update
          </Button>
          <Button
            variant="contained"
            size="medium"
            type="button"
            color="primary"            
            className="ml6"
            onClick={submitAndPrintHandler}
          >
            Update & Print
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default LorryReceiptEdit;
