import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import Select from "@mui/material/Select";
import { Alert, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { getCustomers, getBranches } from "../../../lib/api-master";
import {
  addBill,
  getLorryReceiptsByConsignor,
} from "../../../lib/api-transactions";
import LorryReceipts from "./LorryReceipts";
import LoadingSpinner from "../../UI/LoadingSpinner";

const initialState = {
  branch: "",
  date: new Date(),
  customer: "",
  lrList: [],
  totalAmount: 0,
  serviceTax: 0,
  total: 0,
  dueDate: new Date(),
  remark: "",
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
  customer: {
    invalid: false,
    message: "",
  },
  lrList: {
    invalid: false,
    message: "",
  },
  totalAmount: {
    invalid: false,
    message: "",
  },
  serviceTax: {
    invalid: false,
    message: "",
  },
  total: {
    invalid: false,
    message: "",
  },
  dueDate: {
    invalid: false,
    message: "",
  },
};

const BillAdd = () => {
  const [branches, setBranches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [lorryReceipts, setLorryReceipts] = useState([]);
  const [bill, setBill] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState("");
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const goToBillList = useCallback(() => {
    navigate("/transactions/billList");
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    getBranches(controller)
      .then((response) => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setBranches(response);
          if (response.length) {
            const filteredBranch = response.filter((branch) => {
              return branch.name.toLowerCase() === "camp";
            });
            if (filteredBranch.length) {
              setBill((currState) => {
                return {
                  ...currState,
                  branch: filteredBranch[0]._id,
                };
              });
            }
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

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (bill.branch && bill.customer) {
      setIsLoading(true);
      getLorryReceiptsByConsignor(bill.branch, bill.customer, controller)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            const updatedLR = response.filter((lr) => !lr.billGenerated);
            updatedLR.forEach((lr) => {
              lr.checked = false;
              lr.consignor = customers.filter(
                (customer) => customer._id === lr.consignor
              )[0];
              lr.consignee = customers.filter(
                (customer) => customer._id === lr.consignee
              )[0];
            });
            setLorryReceipts(updatedLR);
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
  }, [bill.branch, bill.customer, customers]);

  //save effect
  useEffect(() => {
    const controller = new AbortController();
    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      addBill(bill, controller)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError("");
            setFormErrors(initialErrorState);
            setBill(initialState);
            goToBillList();
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
  }, [isSubmitted, hasErrors, bill, goToBillList]);

  useEffect(() => {
    let totalToPay = 0;
    bill.lrList.forEach((lr) => {
      totalToPay += +lr.total;
    });

    setBill((currState) => {
      return {
        ...currState,
        totalAmount: totalToPay,
      };
    });
  }, [bill.lrList]);

  useEffect(() => {
    const serviceTaxAmount = (+bill.totalAmount * +bill.serviceTax) / 100;
    const total = +serviceTaxAmount + +bill.totalAmount;
    if (total) {
      setBill((currState) => {
        return {
          ...currState,
          total: total,
        };
      });
    } else {
      setBill((currState) => {
        return {
          ...currState,
          total: bill.totalAmount,
        };
      });
    }
  }, [bill.totalAmount, bill.serviceTax]);

  const resetButtonHandler = () => {
    setBill(initialState);
    setHasErrors(false);
    setHttpError("");
    setFormErrors(initialErrorState);
  };

  const backButtonHandler = () => {
    goToBillList();
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBill((currState) => {
      return {
        ...currState,
        [name]: value,
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors((currState) => validateForm(bill));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };

    if (formData.branch.trim() === "") {
      errors.branch = { invalid: true, message: "Branch is required" };
    }
    if (!formData.date) {
      errors.date = { invalid: true, message: "Date is required" };
    }
    if (formData.customer.trim() === "") {
      errors.customer = { invalid: true, message: "Customer is required" };
    }
    if (!formData.lrList.length) {
      errors.lrList = {
        invalid: true,
        message: "At least one lorry receipt is required",
      };
    }
    if (!formData.totalAmount || isNaN(formData.totalAmount)) {
      errors.lrList = {
        invalid: true,
        message: "Total amount should a number and greater than 0",
      };
    }
    if (formData.serviceTax && isNaN(formData.serviceTax)) {
      errors.serviceTax = {
        invalid: true,
        message: "Service tax should be a number",
      };
    }
    if (!formData.dueDate) {
      errors.dueDate = { invalid: true, message: "Due date is required" };
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
    setBill((currState) => {
      return {
        ...currState,
        [name]: new Date(date),
      };
    });
  };

  const setLRForBill = () => {
    const selectedLR = lorryReceipts.filter((lr) => lr.checked);
    setBill((currState) => {
      return {
        ...currState,
        lrList: selectedLR,
      };
    });
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <h1 className="pageHead">Add a bill</h1>
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
      <form action="" onSubmit={submitHandler} id="billForm">
        <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
          <div className="grid grid-6-col">
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
                  value={bill.branch}
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
            <div className="grid-item">
              <FormControl fullWidth error={formErrors.date.invalid}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    error={formErrors.date.invalid}
                    label="Date"
                    inputFormat="DD/MM/YYYY"
                    value={bill.date}
                    disableFuture={true}
                    onChange={dateInputChangeHandler.bind(null, "date")}
                    inputProps={{
                      readOnly: true,
                    }}
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
            <div className="grid-item">
              <FormControl
                fullWidth
                size="small"
                error={formErrors.customer.invalid}
              >
                <InputLabel id="customer">Customer</InputLabel>
                <Select
                  labelId="customer"
                  name="customer"
                  label="Customer"
                  value={bill.customer}
                  onChange={inputChangeHandler}
                >
                  {customers.length > 0 &&
                    customers.map((customer) => (
                      <MenuItem
                        key={customer._id}
                        value={customer._id}
                        className="menuItem"
                      >
                        {customer.name}
                      </MenuItem>
                    ))}
                </Select>
                {formErrors.customer.invalid && (
                  <FormHelperText>{formErrors.customer.message}</FormHelperText>
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
        <LorryReceipts
          lorryReceipts={lorryReceipts}
          setLRForBill={setLRForBill}
          bill={bill}
          setBill={setBill}
        />

        <Divider sx={{ margin: "20px 0" }} />
        <form action="" onSubmit={submitHandler} id="billForm">
          <div className="grid grid-6-col">
            <div className="grid-item">
              <FormControl fullWidth error={formErrors.totalAmount.invalid}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Total amount"
                  value={bill.totalAmount}
                  error={formErrors.totalAmount.invalid}
                  onChange={inputChangeHandler}
                  name="totalAmount"
                  id="totalAmount"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">&#8377;</InputAdornment>
                    ),
                  }}
                />
                {formErrors.totalAmount.invalid && (
                  <FormHelperText>
                    {formErrors.totalAmount.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth error={formErrors.serviceTax.invalid}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Service tax"
                  value={bill.serviceTax | 0}
                  error={formErrors.serviceTax.invalid}
                  onChange={inputChangeHandler}
                  name="serviceTax"
                  id="serviceTax"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
                {formErrors.serviceTax.invalid && (
                  <FormHelperText>
                    {formErrors.serviceTax.message}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth error={formErrors.total.invalid}>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Total"
                  value={bill.total}
                  error={formErrors.total.invalid}
                  onChange={inputChangeHandler}
                  name="total"
                  id="total"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">&#8377;</InputAdornment>
                    ),
                  }}
                />
                {formErrors.total.invalid && (
                  <FormHelperText>{formErrors.total.message}</FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth error={formErrors.dueDate.invalid}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    error={formErrors.dueDate.invalid}
                    label="Due date"
                    inputFormat="DD/MM/YYYY"
                    value={bill.dueDate}
                    disableFuture={true}
                    onChange={dateInputChangeHandler.bind(null, "dueDate")}
                    inputProps={{
                      readOnly: true,
                    }}
                    renderInput={(params) => (
                      <TextField
                        name="dueDate"
                        size="small"
                        {...params}
                        error={formErrors.dueDate.invalid}
                      />
                    )}
                  />
                </LocalizationProvider>
                {formErrors.dueDate.invalid && (
                  <FormHelperText>{formErrors.dueDate.message}</FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth>
                <TextField
                  size="small"
                  variant="outlined"
                  label="Remark"
                  value={bill.remark}
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
            variant="outlined"
            size="medium"
            onClick={resetButtonHandler}
            className="ml6"
          >
            Reset
          </Button>
          <Button
            variant="contained"
            size="medium"
            type="submit"
            color="primary"
            form="billForm"
            className="ml6"
          >
            Save
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default BillAdd;
