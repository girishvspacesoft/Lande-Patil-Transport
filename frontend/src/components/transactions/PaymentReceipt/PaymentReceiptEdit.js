import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
  Button,
  Paper,
  Divider,
  InputAdornment,
} from "@mui/material";
import { Alert, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { getCustomers } from "../../../lib/api-master";
import {
  getLRForPaymentReceipt,
  getLRForPaymentReceiptById,
  updatedPaymentReceipt,
} from "../../../lib/api-transactions";
import LoadingSpinner from "../../UI/LoadingSpinner";
import LorryReceiptsEdit from "./LorryReceiptsEdit";
import { getFormattedPRNo } from "../../../lib/helper";

const initialState = {
  _id: "",
  prNo: "",
  date: new Date(),
  diesel: "",
  cash: "",
  hamali: "",
  tollCharges: "",
  containmentCharges: "",
  autoCharges: "",
  otherCharges: "",
  amount: "",
  lrList: [],
  remark: "",
};

const initialErrorState = {
  date: {
    invalid: false,
    message: "",
  },
  amount: {
    invalid: false,
    message: "",
  },
  lrList: {
    invalid: false,
    message: "",
  },
};

const UpdatePaymentReceipt = () => {
  const location = useLocation();
  const { prId } = location.state;
  const [lorryReceipts, setLorryReceipts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [paymentReceipt, setPaymentReceipt] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState("");
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldGetLR, setShouldGetLR] = useState(true);

  const navigate = useNavigate();

  const goToPaymentReceipts = useCallback(() => {
    navigate("/transactions/paymentReceipts");
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    getCustomers(controller)
      .then((response) => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setCustomers(response);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setHttpError(
          "Something went wrong! Please try later or contact Administrator."
        );
      });
    setPaymentReceipt({
      ...location.state,
      prNo: getFormattedPRNo(location.state.prNo),
    });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (customers.length && paymentReceipt.lrList.length && shouldGetLR) {
      setIsLoading(true);
      getLRForPaymentReceiptById(controller, paymentReceipt._id)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            const updatedLR = JSON.parse(JSON.stringify(response));
            const selectedLRList = [];
            if (updatedLR.length) {
              updatedLR.forEach((lr) => {
                if (paymentReceipt.lrList.indexOf(lr._id) > -1) {
                  lr.checked = true;
                  selectedLRList.push(lr);
                } else {
                  lr.checked = false;
                }
                lr.consignor = customers.find(
                  (customer) => customer._id === lr.consignor
                );
                lr.consignee = customers.find(
                  (customer) => customer._id === lr.consignee
                );
              });
              setLorryReceipts(updatedLR);
              setPaymentReceipt((currState) => {
                return {
                  ...currState,
                  lrList: selectedLRList,
                };
              });
              setShouldGetLR(false);
            }
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setHttpError(
            "Something went wrong! Please try later or contact Administrator."
          );
        });
    }

    return () => {
      controller.abort();
    };
  }, [customers, paymentReceipt.lrList]);

  useEffect(() => {
    const controller = new AbortController();
    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      updatedPaymentReceipt(paymentReceipt, controller)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError("");
            setFormErrors(initialErrorState);
            setPaymentReceipt(initialState);
            goToPaymentReceipts();
          }
          setIsLoading(false);
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
  }, [isSubmitted, hasErrors, paymentReceipt, goToPaymentReceipts]);

  const backButtonHandler = () => {
    goToPaymentReceipts();
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPaymentReceipt((currState) => {
      return {
        ...currState,
        [name]: value,
      };
    });
  };

  const dateInputChangeHandler = (name, date) => {
    setPaymentReceipt((currState) => {
      return {
        ...currState,
        [name]: new Date(date),
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors((currState) => validateForm(paymentReceipt));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };

    if (!formData.date) {
      errors.date = { invalid: true, message: "Date is required" };
    }
    if (formData.prNo.trim() === "") {
      errors.prNo = {
        invalid: true,
        message: "Payment receipt no is required",
      };
    }
    if (!formData.lrList.length) {
      errors.lrList = {
        invalid: true,
        message: "At least one lorry receipt is required",
      };
    }
    if (formData.amount === 0) {
      errors.amount = {
        invalid: true,
        message: "Amount is required",
      };
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

  const setLRForPR = () => {
    const selectedLR = lorryReceipts.filter((lr) => lr.checked);
    setPaymentReceipt((currState) => {
      return {
        ...currState,
        lrList: selectedLR,
      };
    });
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <h1 className="pageHead">Update a payment voucher</h1>
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
      <form action="" onSubmit={submitHandler} id="prForm">
        <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
          <div className="grid grid-6-col">
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Payment receipt no"
                  value={paymentReceipt.prNo}
                  onChange={inputChangeHandler}
                  name="prNo"
                  id="prNo"
                  inputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth error={formErrors.date.invalid}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    error={formErrors.date.invalid}
                    label="Date"
                    inputFormat="DD/MM/YYYY"
                    value={paymentReceipt.date}
                    disableFuture={true}
                    onChange={dateInputChangeHandler.bind(null, "date")}
                    renderInput={(params) => (
                      <TextField
                        name="date"
                        size="small"
                        {...params}
                        error={formErrors.date.invalid}
                      />
                    )}
                  />
                </LocalizationProvider>
                {formErrors.date.invalid && (
                  <FormHelperText>{formErrors.date.message}</FormHelperText>
                )}
              </FormControl>
            </div>
          </div>
        </Paper>
      </form>
      {formErrors.lrList.invalid && (
        <p className="error">{formErrors.lrList.message}</p>
      )}
      <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
        <LorryReceiptsEdit
          lorryReceipts={lorryReceipts}
          setLRForPR={setLRForPR}
          paymentReceipt={paymentReceipt}
          setPaymentReceipt={setPaymentReceipt}
          showTable={shouldGetLR}
        />

        <Divider sx={{ margin: "20px 0" }} />
        <form action="" onSubmit={submitHandler} id="prForm">
          <div className="grid grid-8-col">
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="number"
                  variant="outlined"
                  label="Diesel"
                  value={paymentReceipt.diesel}
                  onChange={inputChangeHandler}
                  name="diesel"
                  id="diesel"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">&#8377;</InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="number"
                  variant="outlined"
                  label="Cash"
                  value={paymentReceipt.cash}
                  onChange={inputChangeHandler}
                  name="cash"
                  id="cash"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">&#8377;</InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="number"
                  variant="outlined"
                  label="Hamali"
                  value={paymentReceipt.hamali}
                  onChange={inputChangeHandler}
                  name="hamali"
                  id="hamali"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">&#8377;</InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="number"
                  variant="outlined"
                  label="Toll charges"
                  value={paymentReceipt.tollCharges}
                  onChange={inputChangeHandler}
                  name="tollCharges"
                  id="tollCharges"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">&#8377;</InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="number"
                  variant="outlined"
                  label="Containment charges"
                  value={paymentReceipt.containmentCharges}
                  onChange={inputChangeHandler}
                  name="containmentCharges"
                  id="containmentCharges"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">&#8377;</InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="number"
                  variant="outlined"
                  label="Auto charges"
                  value={paymentReceipt.autoCharges}
                  onChange={inputChangeHandler}
                  name="autoCharges"
                  id="autoCharges"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">&#8377;</InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="number"
                  variant="outlined"
                  label="Other charges"
                  value={paymentReceipt.otherCharges}
                  onChange={inputChangeHandler}
                  name="otherCharges"
                  id="otherCharges"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">&#8377;</InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth error={formErrors.amount.invalid}>
                <TextField
                  size="small"
                  type="number"
                  variant="outlined"
                  label="Total"
                  value={paymentReceipt.amount}
                  error={formErrors.amount.invalid}
                  onChange={inputChangeHandler}
                  name="amount"
                  id="amount"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">&#8377;</InputAdornment>
                    ),
                    readOnly: true,
                  }}
                />
                {formErrors.amount.invalid && (
                  <FormHelperText>{formErrors.amount.message}</FormHelperText>
                )}
              </FormControl>
            </div>
          </div>
          <div className="grid grid-4-col">
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Remark"
                  value={paymentReceipt.remark}
                  onChange={inputChangeHandler}
                  name="remark"
                  id="remark"
                />
              </FormControl>
            </div>
          </div>
        </form>
        <div className="right">
          <Button variant="outlined" size="medium" onClick={backButtonHandler}>
            Back
          </Button>
          <Button
            variant="contained"
            size="medium"
            type="submit"
            color="primary"
            form="prForm"
            className="ml6"
          >
            Save
          </Button>
        </div>
      </Paper>
    </>
  );
};
export default UpdatePaymentReceipt;
