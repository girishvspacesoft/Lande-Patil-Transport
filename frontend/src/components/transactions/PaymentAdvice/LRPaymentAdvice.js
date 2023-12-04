import { useState, useEffect } from "react";
import {
  Alert,
  Stack,
  FormControl,
  Button,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import LoadingSpinner from "../../UI/LoadingSpinner";
import { useSelector } from "react-redux";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {
  addPaymentAdvice,
  getAllLorryReceiptsWithCount,
  getLorryReceiptsWithCount,
} from "../../../lib/api-transactions";
import { getFormattedDate, getFormattedLRNumber } from "../../../lib/helper";
import PaymentAdviceHistory from "./PaymentAdviceHistory";

const LRPaymentAdvice = () => {
  const columns = [
    { field: "_id", headerName: "Id" },
    {
      field: "lrNo",
      headerName: "LR no.",
      renderCell: (params) => {
        return getFormattedLRNumber(params.row.lrNo);
      },
    },
    {
      field: "date",
      headerName: "Date",
      renderCell: (params) => {
        return getFormattedDate(new Date(params.row.createdAt));
      },
    },
    { field: "vehicleNo", headerName: "Vehicle no." },
    { field: "from", headerName: "From" },
    { field: "to", headerName: "To" },
    {
      field: "paid",
      headerName: "Paid",
      type: "number",
      renderCell: (params) => {
        return <strong>₹ {params.row.paid.toFixed(2)}</strong>;
      },
    },
    {
      field: "amount",
      headerName: "Pay",
      width: 150,
      renderCell: (params) => {
        return (
          <FormControl fullWidth className="tableTextfield">
            <TextField
              size="small"
              type="number"
              variant="outlined"
              value={params.row.amount}
              onChange={inputChangeHandler.bind(null, "amount")}
              name={params.row._id}
              id={`${params.row._id}_amount`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">&#8377;</InputAdornment>
                ),
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
          </FormControl>
        );
      },
    },
    {
      field: "adviceDescription",
      headerName: "Description",
      flex: 1,
      renderCell: (params) => {
        return (
          <FormControl fullWidth className="tableTextfield">
            <TextField
              size="small"
              variant="outlined"
              value={params.row.adviceDescription}
              onChange={inputChangeHandler.bind(null, "adviceDescription")}
              name={params.row._id}
              id={`${params.row._id}_adviceDescription`}
            />
          </FormControl>
        );
      },
    },
    {
      field: "action",
      headerName: "",
      width: 100,
      align: "center",
      renderCell: (params) => {
        const triggerView = (e) => {
          e.stopPropagation();
          setSelectedLR(params.row);
        };

        const triggerViewOff = (e) => {
          e.stopPropagation();
          setSelectedLR(null);
        };

        if (selectedLR && selectedLR._id === params.row._id) {
          return (
            <IconButton
              size="small"
              onClick={triggerViewOff}
              sx={{ color: "red" }}
              title="Hide payment history"
            >
              <VisibilityOffIcon />
            </IconButton>
          );
        } else {
          return (
            <IconButton
              size="small"
              onClick={triggerView}
              color="primary"
              title="Show payment history"
            >
              <VisibilityIcon />
            </IconButton>
          );
        }
      },
    },
  ];

  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState("");
  const [lorryReceipts, setLorryReceipts] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [getUpdatedLR, setGetUpdatedLR] = useState(true);
  const [selectedLR, setSelectedLR] = useState(null);
  const [page, setPage] = useState(100);
  const [lorryReceiptsCount, setLorryReceiptsCount] = useState(0);
  const [isLastPage, setIsLastPage] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    if (getUpdatedLR) {
      setIsLoading(true);
      if (user.type) {
        if (user.type.toLowerCase() === "superadmin") {
          setIsLoading(true);
          getAllLorryReceiptsWithCount(page, controller)
            .then((response) => {
              if (response.message) {
                setHttpError(response.message);
              } else {
                setLorryReceipts(response.lorryReceipts);
                setLorryReceiptsCount(response.count);
                setIsLastPage(response.isLastPage);
              }
              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
              setHttpError(error.message);
            });
        } else {
          if (user.branch) {
            setIsLoading(true);
            getLorryReceiptsWithCount(page, user.branch, controller)
              .then((response) => {
                if (response.message) {
                  setHttpError(response.message);
                } else {
                  setLorryReceipts(response.lorryReceipts);
                  setLorryReceiptsCount(response.count);
                  setIsLastPage(response.isLastPage);
                }
                setIsLoading(false);
              })
              .catch((error) => {
                setIsLoading(false);
                setHttpError(error.message);
              });
          }
        }
      }
    }
    return () => {
      controller.abort();
    };
  }, [getUpdatedLR, user.branch]);

  useEffect(() => {
    const controller = new AbortController();
    const filteredLR = lorryReceipts.filter((lr) => lr.amount);
    if (isSubmitted) {
      if (!filteredLR.length) {
        setIsSubmitted(false);
      } else {
        setIsLoading(true);
        addPaymentAdvice(filteredLR, controller)
          .then((response) => {
            if (response.message) {
              setHttpError(response.message);
            } else {
              setHttpError("");
              setGetUpdatedLR(true);
            }
            setIsLoading(false);
            setIsSubmitted(false);
          })
          .catch((error) => {
            setIsLoading(false);
            setHttpError(error.message);
          });
      }
    }

    return () => {
      controller.abort();
    };
  }, [isSubmitted, user, lorryReceipts]);

  const inputChangeHandler = (type, e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLorryReceipts((currState) => {
      const updatedState = [...currState];
      updatedState.forEach((lr) => {
        if (type === "adviceDescription") {
          if (lr._id === name) {
            lr.adviceDescription = value;
          }
        }
        if (type === "amount") {
          if (lr._id === name) {
            if (value !== "0" || value !== "") {
              lr.amount = +value;
            } else {
              lr.amount = 0;
            }
          }
        }
      });
      return updatedState;
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}

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

      <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
        <form action="" onSubmit={submitHandler}>
          <DataGrid
            sx={{ backgroundColor: "primary.contrastText" }}
            autoHeight
            density="standard"
            getRowId={(row) => row._id}
            rows={lorryReceipts}
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
            onCellKeyDown={(_cell, event) => event.stopPropagation()}
          />

          <div className="right mt10">
            <Button
              variant="contained"
              size="medium"
              type="submit"
              color="primary"
              className="ml6 mt10"
            >
              Save
            </Button>
          </div>
        </form>
      </Paper>

      <PaymentAdviceHistory
        selectedLR={selectedLR}
        setSelectedLR={setSelectedLR}
      />
    </>
  );
};

export default LRPaymentAdvice;
