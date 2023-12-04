import { useEffect, useState } from "react";
import { TextField, FormControl, FormHelperText, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const initialState = {
  invoiceNo: "",
  boxQuantity: "",
  popQuantity: "",
  looseQuantity: "",
  loosePiece: "",
};

const initialErrorState = {
  invoiceNo: {
    invalid: false,
    message: "",
  },
};

const TransactionDetails = ({ lorryReceipt, setLorryReceipt }) => {
  const columns = [
    { field: "invoiceNo", headerName: "Invoice No", flex: 1 },
    { field: "boxQuantity", headerName: "Box quantity", flex: 1 },
    { field: "popQuantity", headerName: "Pop quantity", flex: 1 },
    { field: "looseQuantity", headerName: "Loose quantity", flex: 1 },
    { field: "loosePiece", headerName: "Loose piece", flex: 1 },
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
            boxQuantity: transactionDetail.boxQuantity
              ? transactionDetail.boxQuantity
              : 0,
            popQuantity: transactionDetail.popQuantity
              ? transactionDetail.popQuantity
              : 0,
            looseQuantity: transactionDetail.looseQuantity
              ? transactionDetail.looseQuantity
              : 0,
            loosePiece: transactionDetail.loosePiece
              ? transactionDetail.loosePiece
              : 0,
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
      errors.articleNo = {
        invalid: true,
        message: "Invoice number is required",
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
            <FormControl fullWidth>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Box quantity"
                value={transactionDetail.boxQuantity}
                onChange={inputChangeHandler}
                name="boxQuantity"
                id="boxQuantity"
              />
            </FormControl>
          </div>
          <div className="grid-item">
            <FormControl fullWidth>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Pop quantity"
                value={transactionDetail.popQuantity}
                onChange={inputChangeHandler}
                name="popQuantity"
                id="popQuantity"
              />
            </FormControl>
          </div>
          <div className="grid-item">
            <FormControl fullWidth>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Loose outer quantity"
                value={transactionDetail.looseQuantity}
                onChange={inputChangeHandler}
                name="looseQuantity"
                id="looseQuantity"
              />
            </FormControl>
          </div>
          <div className="grid-item">
            <FormControl fullWidth>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Loose piece quantity"
                value={transactionDetail.loosePiece}
                onChange={inputChangeHandler}
                name="loosePiece"
                id="loosePiece"
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
        sx={{ backgroundColor: "primary.contrastText" }}
        autoHeight
        density="compact"
        getRowId={(row) => row.id || row._id}
        rows={lorryReceipt.transactions}
        columns={columns}
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
    </div>
  );
};

export default TransactionDetails;
