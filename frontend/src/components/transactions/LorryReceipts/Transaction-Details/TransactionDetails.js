import { useEffect, useState } from "react";
import { TextField, FormControl, FormHelperText, Button, Autocomplete } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const initialState = {
  invoiceNo: "",
  article: "",
  company: "",
  place: "",
  articleNum: 0,
  weight: 0,
  remark: "",
  payment: 0,
};

const initialErrorState = {
  invoiceNo: {
    invalid: false,
    message: "",
  },
  company: {
    invalid: false,
    message: "",
  },
  place: {
    invalid: false,
    message: "",
  },
  article: {
    invalid: false,
    message: "",
  },
  articleNum: {
    invalid: false,
    message: "",
  },
  weight: {
    invalid: false,
    message: "",
  },
  payment: {
    invalid: false,
    message: "",
  },
};

const TransactionDetails = ({ lorryReceipt, setLorryReceipt, customers }) => {
  const columns = [
    { field: "invoiceNo", headerName: "Invoice No", flex: 1 },
    { field: "company", headerName: "Company / Description", flex: 1 },
    { field: "place", headerName: "Place", flex: 1 },
    { field: "article", headerName: "Article", flex: 1 },
    { field: "articleNum", headerName: "No of article", flex: 1 },
    { field: "weight", headerName: "Weight", flex: 1 },
    { field: "payment", headerName: "payment", flex: 1 },
    { field: "remark", headerName: "Remark", flex: 1 },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const triggerEdit = (e) => {
          e.stopPropagation();
          return navigateToEdit(
            params.row.id || params.row._id,
            params.row._id ? true : false
          );
        };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteTransactionDetail(
            params.row.id || params.row._id,
            params.row._id ? true : false
          );
        };

        return (
          <>
            <IconButton size="small" onClick={triggerEdit} color="primary">
              <EditIcon />
            </IconButton>
            &nbsp;&nbsp;
            <IconButton size="small" onClick={triggerDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [transactionDetail, setTransactionDetail] = useState(initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (isSubmitted && !hasErrors) {
      setLorryReceipt((currentState) => {
        let updatedState = {
          ...currentState,
          transactions: [...currentState.transactions],
        };
        if (!isEditMode) {
          const updatedTransactionDetail = {
            ...transactionDetail,            
            id: Math.random(),
          };
          updatedState.transactions = [
            ...currentState.transactions,
            { ...updatedTransactionDetail },
          ];
        } else {
          let filteredDetails;
          if (!updatedState.transactions[0]._id) {
            filteredDetails = updatedState.transactions.filter(
              (detail) => detail.id !== transactionDetail.id
            );
          } else {
            filteredDetails = updatedState.transactions.filter(
              (detail) => detail._id !== transactionDetail._id
            );
          }
          const updatedDetail = { ...transactionDetail };
          updatedState.transactions = [
            ...filteredDetails,
            { ...updatedDetail },
          ];
        }
        return updatedState;
      });
      setTransactionDetail(initialState);

      setIsSubmitted(false);
      setIsEditMode(false);
    }
  }, [isSubmitted, hasErrors, transactionDetail, isEditMode, setLorryReceipt]);

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTransactionDetail((currState) => {
      return {
        ...currState,
        [name]: value,
      };
    });
  };

  const resetButtonHandler = () => {
    setTransactionDetail(initialState);
    setFormErrors(initialErrorState);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors((currState) => validateForm(transactionDetail));
    setIsSubmitted(true);
  };

  const navigateToEdit = (id, has_Id) => {
    let editedTransactionDetail;
    if (!has_Id) {
      editedTransactionDetail = {
        ...lorryReceipt.transactions.filter((detail) => detail.id === id)[0],
      };
    } else {
      editedTransactionDetail = {
        ...lorryReceipt.transactions.filter((detail) => detail._id === id)[0],
      };
    }
    setTransactionDetail(editedTransactionDetail);
    setIsEditMode(true);
  };

  const deleteTransactionDetail = (selectedId, has_Id) => {
    let updatedTransactions;
    if (!has_Id) {
      updatedTransactions = lorryReceipt.transactions.filter(
        (detail) => detail.id !== selectedId
      );
    } else {
      updatedTransactions = lorryReceipt.transactions.filter(
        (detail) => detail._id !== selectedId
      );
    }
    setLorryReceipt((currentState) => {
      return {
        ...currentState,
        transactions: updatedTransactions,
      };
    });
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.invoiceNo.trim() === "") {
      errors.invoiceNo = {
        invalid: true,
        message: "Invoice number is required",
      };
    }

    if (formData.company.trim() === "") {
      errors.company = {
        invalid: true,
        message: "Company Name is required",
      };
    }

    if (formData.place.trim() === "") {
      errors.place = {
        invalid: true,
        message: "Place is required",
      };
    }

    if (formData.article.trim() === "") {
      errors.article = {
        invalid: true,
        message: "Article is required",
      };
    }

    // if (formData.articleNum.trim() === "") {
    //   errors.articleNum = {
    //     invalid: true,
    //     message: "Number is required",
    //   };
    // }

    if (formData.weight <= 0) {
      errors.weight = {
        invalid: true,
        message: "Weight is required",
      };
    }

    if (formData.payment <= 0) {
      errors.payment = {
        invalid: true,
        message: "payment is required",
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

  const companyChangeHandler = (e, value) => {
    
    if (value) {
      if (typeof value === "object") {
        setTransactionDetail((currState) => {
          return {
            ...currState,
            company: value.label,
            place: value.city
          }
        });
      } else {
        setTransactionDetail((currState) => {
          return {
            ...currState,
            company: value,
          };
        });
      }
    } else {
      setTransactionDetail((currState) => {
        return {
          ...currState,
          company: '',
        };
      });
    }
    
  };

  return (
    <div>
      <form
        id="transactionDetailsForm"
        onSubmit={submitHandler}
        className="mb20"
      >
        <div className="grid grid-7-col">
          <div className="grid-item">
            <FormControl fullWidth error={formErrors.invoiceNo.invalid}>
              <TextField
                size="small"
                variant="outlined"
                label="Invoice number"
                value={transactionDetail.invoiceNo}
                error={formErrors.invoiceNo.invalid}
                onChange={inputChangeHandler}
                name="invoiceNo"
                id="invoiceNo"
              />
              {formErrors.invoiceNo.invalid && (
                <FormHelperText>{formErrors.invoiceNo.message}</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="grid-item">
            <FormControl fullWidth error={formErrors.company.invalid}>
                <Autocomplete
                  freeSolo
                  autoSelect
                  size="small"
                  name="company"
                  options={customers}
                  value={transactionDetail.company}
                  getOptionLabel={(option) => option.label || option}
                  onChange={(e, value) => companyChangeHandler(e, value)}
                  openOnFocus
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Company"
                      error={formErrors.company.invalid}
                      fullWidth
                    />
                  )}
                />
              {formErrors.company.invalid && (
                <FormHelperText>{formErrors.company.message}</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="grid-item">
            <FormControl fullWidth error={formErrors.place.invalid}>
              <TextField
                size="small"
                variant="outlined"
                label="Place"
                value={transactionDetail.place}
                error={formErrors.place.invalid}
                onChange={inputChangeHandler}
                name="place"
                id="place"
              />
              {formErrors.place.invalid && (
                <FormHelperText>{formErrors.place.message}</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="grid-item">
            <FormControl fullWidth error={formErrors.article.invalid}>
              <TextField
                size="small"
                variant="outlined"
                label="Article"
                value={transactionDetail.article}
                error={formErrors.article.invalid}
                onChange={inputChangeHandler}
                name="article"
                id="article"
              />
              {formErrors.article.invalid && (
                <FormHelperText>{formErrors.article.message}</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="grid-item">
            <FormControl fullWidth error={formErrors.articleNum.invalid}>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Article No"
                value={transactionDetail.articleNum}
                error={formErrors.articleNum.invalid}
                onChange={inputChangeHandler}
                name="articleNum"
                id="articleNum"
              />
              {formErrors.articleNum.invalid && (
                <FormHelperText>{formErrors.articleNum.message}</FormHelperText>
              )}
            </FormControl>

          </div>
          <div className="grid-item">
          <FormControl fullWidth error={formErrors.weight.invalid}>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Weight"
                value={transactionDetail.weight}
                error={formErrors.weight.invalid}
                onChange={inputChangeHandler}
                name="weight"
                id="weight"
              />
              {formErrors.weight.invalid && (
                <FormHelperText>{formErrors.weight.message}</FormHelperText>
              )}
            </FormControl>
          </div>
         
          <div className="grid-item">
            <FormControl fullWidth error={formErrors.payment.invalid}>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Payment"
                value={transactionDetail.payment}
                error={formErrors.payment.invalid}
                onChange={inputChangeHandler}
                name="payment"
                id="payment"
              />
              {formErrors.payment.invalid && (
                <FormHelperText>{formErrors.payment.message}</FormHelperText>
              )}
            </FormControl>
          </div> 
          <div className="grid-item">
            <FormControl fullWidth>
              <TextField
                size="small"
                variant="outlined"
                label="Remark"
                value={transactionDetail.remark}                
                onChange={inputChangeHandler}
                name="remark"
                id="remark"
              />
              
            </FormControl>
          </div>
        </div>

        <div className="right">
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
            form="transactionDetailsForm"
            className="ml6"
          >
            {isEditMode ? "Update" : "Add"}
          </Button>
        </div>
      </form>
      <DataGrid
        sx={{ backgroundColor: "primary.contrastText"}}
        autoHeight
        density="compact"
        getRowId={(row) => row.id || row._id}
        rows={lorryReceipt.transactions}
        columns={columns}
        slots={{
            footer: <p>Hello</p>,
          }}
        initialState={{
          ...columns,
          columns: {
            columnVisibilityModel: {
              _id: false,
            },
          },
        }}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
      /> 
      <p style={{marginTop: '15px'}}>Total No of Article : {  lorryReceipt.transactions.reduce((total, num) => total + Math.round(Number(num.articleNum)) , 0)} Total Weight : {  lorryReceipt.transactions.reduce((total, num) => total + Math.round(Number(num.weight)) , 0)}</p>          
    </div>
  );
};

export default TransactionDetails;
