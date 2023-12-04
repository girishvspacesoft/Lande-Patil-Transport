import { useEffect, useState, useCallback } from "react";
import { Paper } from "@mui/material";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import { Alert, Stack, Button, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import LoadingSpinner from "../../UI/LoadingSpinner";

import { PR_PATH } from "../../../lib/api-base-paths";

import { getFormattedDate, getFormattedPRNo } from "../../../lib/helper";
import {
  deletePaymentReceipt,
  downloadPaymentReceipt,
  getPaymentReceipts,
} from "../../../lib/api-transactions";
import { useNavigate } from "react-router-dom";

const PaymentReceipts = () => {
  const columns = [
    { field: "_id", headerName: "Id" },
    {
      field: "prNo",
      headerName: "PR no.",
      flex: 1,
      renderCell: (params) => {
        return getFormattedPRNo(params.row.prNo);
      },
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => {
        return getFormattedDate(new Date(params.row.date));
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      type: "number",
      renderCell: (params) => {
        return <strong>₹ {(+params.row.amount).toFixed(2)}</strong>;
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const triggerDownload = (e) => {
          e.stopPropagation();
          triggerViewPR({ ...params.row, download: true });
        };

        const triggerView = (e) => {
          e.stopPropagation();
          triggerViewPR({ ...params.row, download: false });
        };

        // const triggerPrint = (e) => {
        //   e.stopPropagation();
        //   console.log("Print");
        // };

        // const triggerEmail = (e) => {
        //   e.stopPropagation();
        //   console.log("Email");
        // };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteLR(params.row._id);
        };

        const triggerEdit = (e) => {
          e.stopPropagation();
          navigate("/transactions/paymentReceipts/editPaymentReceipt", {
            state: { ...params.row },
          });
        };

        return (
          <>
            <IconButton size="small" onClick={triggerView} color="primary">
              <VisibilityIcon />
            </IconButton>
            <IconButton size="small" onClick={triggerDownload} color="primary">
              <DownloadIcon />
            </IconButton>
            <IconButton size="small" onClick={triggerEdit} color="primary">
              <EditIcon />
            </IconButton>
            {/* <IconButton size="small" onClick={triggerEmail} color="primary">
              <EmailIcon />
            </IconButton> */}
            <IconButton size="small" onClick={triggerDelete} color="error">
              <DeleteIcon />
            </IconButton> 
          </>
        );
      },
    },
  ];

  const navigate = useNavigate();
  const [paymentReceipts, setPaymentReceipts] = useState([]);
  const [httpError, setHttpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    getPaymentReceipts(controller)
      .then((response) => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setPaymentReceipts(response);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setHttpError(error.message);
      });
    return () => {
      controller.abort();
    };
  }, []);

  const handleAddPR = () => {
    navigate("/transactions/paymentReceipts/addPaymentReceipt");
  };

  const triggerViewPR = (pr) => {
    const controller = new AbortController();
    if (pr && pr._id) {
      setIsLoading(true);
      downloadPaymentReceipt(pr._id, controller)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            if (pr.download) {
              downloadFile(pr);
            } else {
              const path = PR_PATH + getFormattedPRNo(pr.prNo) + ".pdf";
              window.open(path, "_blank");
            }
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setHttpError(error.message);
        });
      return () => {
        controller.abort();
      };
    }
  };

  const downloadFile = useCallback((pr) => {
    const baseURL = PR_PATH + getFormattedPRNo(pr.prNo) + ".pdf";
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
  }, []);

  const deleteLR = (id) => {
    
    const controller = new AbortController();
    
      setIsLoading(true);
      deletePaymentReceipt({_id: id}, controller)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError("");
            const delReverseData = paymentReceipts.filter(item => item._id !== id)
           setPaymentReceipts(delReverseData)
          }
          setIsLoading(false);
          setIsSubmitted(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setHttpError(error.message);
        });
       
  }
  return (
    <>
      {isLoading && <LoadingSpinner />}

      <div className="page_head">
        <h1 className="pageHead">Payment vouchers</h1>
        <div className="page_actions">
          <Button
            variant="contained"
            size="small"
            type="button"
            color="primary"
            className="ml6"
            onClick={handleAddPR}
          >
            Add a payment voucher
          </Button>
        </div>
      </div>

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
        <DataGrid
          sx={{ backgroundColor: "primary.contrastText" }}
          autoHeight
          density="standard"
          getRowId={(row) => row._id}
          rows={paymentReceipts}
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
      </Paper>
    </>
  );
};

export default PaymentReceipts;
