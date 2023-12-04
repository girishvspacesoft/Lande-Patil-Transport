import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  IconButton,
  Alert,
  Stack,
  Paper,
  FormControl,
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
import LoadingSpinner from "../../UI/LoadingSpinner";
import Dialog from "../../UI/Dialog";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSelector } from "react-redux";
import FileSaver from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";
import {
  downloadMISReport,
  getAllLorryReceiptsDateRange,
  getLorryReceiptsWithCountDateRange,
  updateLorryReceiptDateRange,
} from "../../../lib/api-transactions";

var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const imageDownload = (e, url) => {
  e.preventDefault();
  var element = document.createElement("a");
  var file = new Blob(
    [
      url
    ],
    { type: "image/*" }
  );
  element.href = URL.createObjectURL(file);

  element.click();
};
const LorryReceiptRegister = () => {
  const columns = [
    { field: "_id", headerName: "Id" },
    // { field: "srNo", headerName: "SR No.", width: 100 },
    { field: "lrNo", headerName: "LR No.", width: 100, renderCell: (params) => {
        
      return (
        <>
        {
          `PUN-${params.row.lrNo.toString().padStart(6, "0")}`
        }
        </>
      );
    } },
    { field: "date", headerName: "Date", width: 200 },
    { field: "consignee", headerName: "Consignee", width: 200 },
    { field: "consignor", headerName: "Consignor", width: 200 },
    { field: "vehicleNo", headerName: "Vehicle", width: 200 },
    {
      field: "u-date",
      headerName: "Update Date & Time",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        
        return (
          <>
            {!params.row.ack ? null : (
              <>                
                {
                  dayjs(params.row.updatedAt).format("DD-MMM-YYYY") +"    "+ dayjs(params.row.updatedAt).format("hh:mm a")
                }
              </>
            )}           
          </>
        );
      },
    },
    {
      field: "yesNo",
      headerName: "Yes/No",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <Checkbox
              onChange={() => handleYesNo(params.row._id)}
              checked={params.row.yesNo === "no" ? false : true}
            />
          </>
        );
      },
    },
    {
      field: "remark",
      headerName: "Remark",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            <TextField
              onChange={(event) => handleRemark(params.row._id, event)}
              value={params.row.remark}
            />
          </div>
        );
      },
    },
        
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 120,
      renderCell: (params) => {
        
        return (
          <>
            {!params.row.ack ? null : (
              <a onClick={(e) => imageDownload(e, params.row.ack)} style={{color: '#000000'}} href={`${params.row.ack}`} download>
                <DownloadIcon />
              </a>
            )}
          </>
        );
      },
    },
  ];

  const [oldState, setOldState] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const user = useSelector((state) => state.user);
  const [httpError, setHttpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState("");
  const [deleteLrAckId, setDeleteLrAckId] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [pageCount, setPageCount] = useState(100);
  const [rangeDates, setRangeDates] = useState({
    fromDate: dayjs(firstDay),
    toDate: dayjs(),
  });
  const [lorryReceipts, setLorryReceipts] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [downloadReport, setDownloadReport] = useState(false);

  const handleYesNo = (id) => {
    setIsDisabled(false);
    setLorryReceipts((prev) => {
      const newPrev = prev.map((item) => {
        if (item._id === id) {
          item.yesNo = item.yesNo === "no" ? "yes" : "no";
          item.change = true;
        }
        return item;
      });

      return newPrev;
    });
  };

  const handleRemark = (id, event) => {
    setIsDisabled(false);

    setLorryReceipts((prev) => {
      const newPrev = prev.map((item) => {
        if (item._id === id) {
          item.remark = event.target.value;
          item.change = true;
        }
        return item;
      });

      return newPrev;
    });
  };

  const handleReset = () => {
    setIsDisabled(true);
    setLorryReceipts(oldState);
  };

  useEffect(() => {
    const controller = new AbortController();
    if (page && limit && user) {
      setIsLoading(true);
      if (user.type) {
        if (user.type.toLowerCase() === "superadmin") {
          getAllLorryReceiptsDateRange(page, limit, rangeDates, controller)
            .then((response) => {
              
              if (response.message) {
                setHttpError(response.message);
              } else {
                setLorryReceipts(response.lorryReceipts);
                setOldState(response.lorryReceipts);
                setPageCount(response.count)
              }
              setIsSubmitted(false);
              setIsLoading(false);
            })
            .catch((error) => {
              setIsSubmitted(false);
              setIsLoading(false);
              setHttpError(error.message);
            });
        } else {
          if (user.branch) {
            getLorryReceiptsWithCountDateRange(
              page,
              limit,
              user.branch,
              controller,
              rangeDates
            )
              .then((response) => {
                console.log(response)
                if (response.message) {
                  setHttpError(response.message);
                } else {
                  setLorryReceipts(response.lorryReceipts);
                  setOldState(response.lorryReceipts);
                  setPageCount(response.count)
                }
                setIsSubmitted(false);
                setIsLoading(false);
              })
              .catch((error) => {
                setIsSubmitted(false);
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
  }, [page, limit, user, isSubmitted]);

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === "true") {
      setDeleteLrAckId(selectedDeleteId);
    } else {
      setDeleteLrAckId("");
    }
    setIsDialogOpen(false);
  };

  const inputChangeHandler = (value, name) => {
    setRangeDates((currState) => {
      return {
        ...currState,
        [name]: value,
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  useEffect(() => {
    const controller = new AbortController();
    if (isUpdated) {
      setIsLoading(true);
      updateLorryReceiptDateRange(lorryReceipts, controller)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setLorryReceipts((prev) => {
              const newPrev = prev.map((item) => {
                if (item.change) {
                  item.change = false;
                }
                return item;
              });

              return newPrev;
            });
            setOldState(lorryReceipts);
            setIsDisabled(true);
          }
          setIsUpdated(false);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsUpdated(false);
          setIsLoading(false);
          setHttpError(error.message);
        });
    }

    return () => {
      controller.abort();
    };
  }, [isUpdated]);

  const handleUpdate = () => {
    setIsUpdated(true);
  };

  const handleDownload = () => {
    setDownloadReport(true);
  };

  useEffect(() => {
    const controller = new AbortController();

    if (rangeDates && downloadReport) {
      setIsLoading(true);
      downloadMISReport(rangeDates, controller)
        .then((res) => {
          setIsLoading(false);
          setDownloadReport(false);
        
          FileSaver.saveAs(res, "LorryReceipts.xlsx");
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
          setDownloadReport(false);
          setHttpError("Something went wrong!");
        });
    }
    return () => {
      controller.abort();
    };
  }, [downloadReport, rangeDates]);



  return (
    <>
      {isLoading && <LoadingSpinner />}

      {isDialogOpen && (
        <Dialog
          isOpen={true}
          onClose={handleDialogClose}
          title="Are you sure?"
          content="Do you want to delete the Lorry receipt acknowledgement image?"
          warning
        />
      )}

      <div className="page_head">
        <h1 className="pageHead">MIS Report</h1>
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
        <form onSubmit={submitHandler} action="">
          <div className="grid grid-6-col">
            <div className="grid-item">
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From"
                    inputFormat="DD/MM/YYYY"
                    value={rangeDates.fromDate}
                    disableFuture={true}
                    name="fromDate"
                    onChange={(value) => inputChangeHandler(value, "fromDate")}
                    inputProps={{
                      readOnly: true,
                    }}
                    renderInput={(params) => (
                      <TextField name="dateOfBirth" size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To"
                    inputFormat="DD/MM/YYYY"
                    value={rangeDates.toDate}
                    name="toDate"
                    disableFuture={true}
                    onChange={(value) => inputChangeHandler(value, "toDate")}
                    inputProps={{
                      readOnly: true,
                    }}
                    renderInput={(params) => (
                      <TextField name="dateOfBirth" size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
            <div className="grid-item">
              <FormControl fullWidth>
                <Button
                  variant="contained"
                  size="medium"
                  type="submit"
                  color="primary"
                >
                  Show
                </Button>
              </FormControl>
            </div>
          </div>
        </form>
      </Paper>
      <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
        <div className="right">
          <Button
            onClick={handleDownload}
            variant="outlined"
            size="medium"
            className="ml6 mb10"
          >
            Download
          </Button>
        </div>
        <DataGrid
          sx={{ backgroundColor: "primary.contrastText" }}
          autoHeight
          density="compact"
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
          
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: false,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          pageSize={limit}          
          rowsPerPageOptions={[10, 50, 100]}
          disableSelectionOnClick
          onCellKeyDown={(params, events) => events.stopPropagation()}
          onPageSizeChange={(size) => setLimit(size)}
          onPageChange={(page) => {
            setPage(page + 1);
          }}

          rowCount={pageCount}
          paginationModel={{
            pageSize: limit,
            page: 1
          }}
          paginationMode="server"
          pageSizeOptions={[limit]}
          
        />

        <div className="right">
          <Button
            onClick={handleReset}
            variant="outlined"
            size="medium"
            className="ml6"
          >
            Reset
          </Button>
          <Button
            disabled={isDisabled}
            onClick={handleUpdate}
            variant="contained"
            size="medium"
            type="submit"
            color="primary"
            className="ml6"
          >
            Update
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default LorryReceiptRegister;
