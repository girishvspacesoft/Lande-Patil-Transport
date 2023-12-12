import { Worker } from "@react-pdf-viewer/core";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  IconButton,
  Alert,
  Stack,
  InputLabel,
  MenuItem,
  FormControl,
  Button,
  Box,
} from "@mui/material";
import Select from "@mui/material/Select";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import LoadingSpinner from "../../UI/LoadingSpinner";
import CustomDialog from "../../UI/Dialog";
import Dialog from "@mui/material/Dialog";

import { getBranches, getCustomers } from "../../../lib/api-master";
import {
  downloadLorryReceipt,
  getAllLorryReceiptsWithCount,
  getLorryReceiptsWithCount,
  removeLorryReceipt,
  viewLorryReceipt,
} from "../../../lib/api-transactions";
import { getFormattedDate, getFormattedLRNumber } from "../../../lib/helper";

import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useSelector } from "react-redux";
import { BILLS_PATH } from "../../../lib/api-base-paths";

const LorryReceipts = (props) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const columns = [
    { field: "_id", headerName: "Id" },
    { field: "sl", headerName: "SR no.", width: 100 },
    { field: "consigno", headerName: "Consigno", width: 200 },
    { field: "formattedDate", headerName: "ConsignDate", width: 100 },
    {
      field: "consignor",
      headerName: "Consignor",
      flex: 1,      
    },
    { field: "from", headerName: "From", width: 130 },
    {
      field: "consignee",
      headerName: "Consignee",
      flex: 1,      
    },
    { field: "to", headerName: "To", width: 130 },
    {
      field: "actions",
      headerName: "",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const triggerDownload = (e) => {
          e.stopPropagation();
          triggerViewLR({ ...params.row, download: true });
          // console.log('view lorry receipt pdf')
        };

        const triggerView = (e) => {
          e.stopPropagation();
          triggerViewLR({ ...params.row, download: false });
        };

        const triggerPrint = (e) => {
          e.stopPropagation();
          console.log("Print");
        };

        const triggerEmail = (e) => {
          e.stopPropagation();
          console.log("Email");
        };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteLR(params.row._id);
        };

        const triggerEdit = (e) => {
          e.stopPropagation();
          return navigateToEdit(params.row._id);
        };

        return (
          <>
            {!params.row.isBlank && (
              <>
                <IconButton
                  size="small"
                  onClick={triggerDownload}
                  color="primary"
                >
                  <DownloadIcon />
                </IconButton>

                <IconButton size="small" onClick={triggerView} color="primary">
                  <VisibilityIcon />
                </IconButton>
                {/* <IconButton size="small" onClick={triggerEmail} color="primary">
                  <EmailIcon />
                </IconButton> */}
              </>
            )}
           
            <IconButton size="small" onClick={triggerEdit} color="primary">
              <EditIcon />
            </IconButton> 
            <IconButton size="small" onClick={triggerDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [branches, setbranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [lorryReceipts, setLorryReceipts] = useState([]);
  const [lorryReceiptsCount, setLorryReceiptsCount] = useState(0);
  const [isLastPage, setIsLastPage] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [updatedLorryReceipts, setUpdatedLorryReceipts] = useState([]);
  const [httpError, setHttpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLRId, setDeleteLRId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [viewLR, setViewLR] = useState(null);
  const [file, setFile] = useState(null);
  const [showFile, setShowFile] = useState(false);
  const [filterData, setFilterData] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    if (page && limit && user) {
      if (user.type && selectedBranch) {

        const type = "deliver";
        if (user.type.toLowerCase() === "superadmin") {
          setIsLoading(true);
          getAllLorryReceiptsWithCount(page, limit, filterData, type, selectedBranch._id, controller)
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
            
            getLorryReceiptsWithCount(page, user.branch, limit, filterData, type, controller)
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
  }, [selectedBranch, page, limit, user, filterData]);


  useEffect(() => {
    const controller = new AbortController();

    if (lorryReceipts.length) {
      setIsLoading(true);
      getCustomers(controller)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError("");
            const updatedLorryReceipts = lorryReceipts.map((lorryReceipt, key) => {
              const consignor = response.filter(
                (customer) => customer._id === lorryReceipt.consignor
              );
              const consignee = response.filter(
                (customer) => customer._id === lorryReceipt.consignee
              );
              return {
                ...lorryReceipt,
                consignor: consignor.length
                  ? consignor[0]
                  : lorryReceipt.consignor,
                consignee: consignee.length
                  ? consignee[0]
                  : lorryReceipt.consignee,
                formattedDate: getFormattedDate(lorryReceipt.createdAt),
                sl: key + 1
              };
            });
            setUpdatedLorryReceipts(updatedLorryReceipts);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setHttpError(
            "Something went wrong! Please try later or contact Administrator."
          );
        });
    } else {
      setUpdatedLorryReceipts([]);
    }

    return () => {
      controller.abort();
    };
  }, [lorryReceipts]);

  useEffect(() => {
    const controller = new AbortController();
    if (deleteLRId) {
      setIsLoading(true);
      removeLorryReceipt(deleteLRId, controller)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            if (response.id) {
              setDeleteLRId("");
              setUpdatedLorryReceipts(
                updatedLorryReceipts.filter((lr) => lr._id !== response.id)
              );
            }
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
  }, [deleteLRId, updatedLorryReceipts]);

  const downloadFile = useCallback(
    (blob, fileName) => {
      const selectedLR = lorryReceipts.find((lr) => lr._id === viewLR._id);
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
    [lorryReceipts, viewLR]
  );

  useEffect(() => {
    const controller = new AbortController();
    if (viewLR && viewLR._id) {
      setIsLoading(true);
      if(viewLR.download){
        downloadLorryReceipt(viewLR._id, controller)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            const selectedLR = lorryReceipts.find(
              (lr) => lr._id === viewLR._id
            );
            if (viewLR.download) {
              const name = getFormattedLRNumber(selectedLR.lrNo) + ".pdf";
              downloadFile(response, name);
            } else {
              const path =
                BILLS_PATH + getFormattedLRNumber(selectedLR.lrNo) + ".pdf";
              window.open(path, "_blank");
            }
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setHttpError(error.message);
          setIsLoading(false);
        });
      } else {
        viewLorryReceipt(viewLR._id, controller)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            const selectedLR = lorryReceipts.find(
              (lr) => lr._id === viewLR._id
            );
            if (viewLR.download) {
              const name = getFormattedLRNumber(selectedLR.lrNo) + ".pdf";
              downloadFile(response, name);
            } else {
              const path =
                BILLS_PATH + getFormattedLRNumber(selectedLR.lrNo) + ".pdf";
              window.open(path, "_blank");
            }
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setHttpError(error.message);
          setIsLoading(false);
        });
      }
    }
    return () => {
      controller.abort();
    };
  }, [viewLR, lorryReceipts, downloadFile]);

  const handleAddLR = () => {
    navigate("/transactions/lorryReceipts/addLorryReceipt");
  };

  const navigateToEdit = (id) => {
    navigate("/transactions/lorryReceipts/editLorryReceipt", {
      state: { lrId: id },
    });
  };

  const triggerViewLR = (lr) => {
    setViewLR(lr);
    if (lr.download) {
      setShowFile(false);
    } else {
      setShowFile(true);
    }
  };

  const deleteLR = (id) => {
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === "true") {
      setDeleteLRId(selectedId);
    } else {
      setSelectedId("");
    }
    setIsDialogOpen(false);
  };

  const handleClose = () => {
    setFile(null);
    setViewLR(null);
  };

  const branchChangeHandler = (e) => {
    const filteredBranch = branches.filter(
      (branch) => branch._id === e.target.value
    );
    setSelectedBranch(filteredBranch[0]);
  };

  // const getPrev = () => {
  //   setPage(currState => currState - 1);
  // }

  // const getNext = () => {
  //   setPage(currState => currState + 1);
  // }

  const onFilterChange = useCallback(({quickFilterValues}) => {    
    setFilterData(quickFilterValues[0] || "");    
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    getBranches(controller)
      .then(response => {
        if (response.messgage) {
          setHttpError(response.message);
        } else {
          setbranches(response);
          setSelectedBranch(response[0])
        }
        setIsLoading(false);
      })
      .catch(error => {
        setHttpError(error.message);
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner />}

      {isDialogOpen && (
        <CustomDialog
          isOpen={true}
          onClose={handleDialogClose}
          title="Are you sure?"
          content="Do you want to delete the lorry receipt?"
          warning
        />
      )}

      {file && (
        <Dialog open={showFile} onClose={handleClose} fullScreen>
          {/* <Document file={file} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError}>
        <Page height={800} pageNumber={pageNumber} />
      </Document> */}
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
            <Viewer
              fileUrl={file}
              name="test.pdf"
              defaultScale={1.5}
              plugins={[defaultLayoutPluginInstance]}
            />
          </Worker>
        </Dialog>
      )}

      <div className="page_head">
        <h1 className="pageHead">Direct Lorry Receipt List</h1>
        <div className="page_actions">
          {selectedBranch && (user.type.toLowerCase() === "admin" ||
            user.type.toLowerCase() === "superadmin") && (
            <FormControl
              size="small"
              sx={{ width: "150px", marginRight: "5px" }}
            >
              <InputLabel id="branch">Select branch</InputLabel>
              <Select
                labelId="branch"
                name="branch"
                label="Select branch"
                value={selectedBranch._id}
                onChange={branchChangeHandler}
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
            </FormControl>
          )}
          <Button
            variant="contained"
            size="small"
            type="button"
            color="primary"
            className="ml6"
            onClick={handleAddLR}
          >
            Add lorry receipt
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

      <div style={{ width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            "& .hot": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <DataGrid
            sx={{ backgroundColor: "primary.contrastText" }}
            autoHeight
            density="compact"
            getRowId={(row) => row._id}
            rows={updatedLorryReceipts}
            columns={columns}
            getCellClassName={(params) => {
              return params.row.isBlank ? "hot" : "";
            }}
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
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            // components={{
            //   Pagination: false,
            // }}
            filterMode="server"
            onFilterModelChange={onFilterChange}
            pageSize={limit}
            rowsPerPageOptions={[10, 50, 100]}
            disableSelectionOnClick
            onPageSizeChange={(size) => setLimit(size)}
            onPageChange={(page) => {
            setPage(page + 1);
          }}

          rowCount={lorryReceiptsCount}
          paginationModel={{
            pageSize: limit,
            page: 1
          }}
          paginationMode="server"
          pageSizeOptions={[limit]}
            
          />
        </Box>
        {/* <div style={{ margin: '10px 0' }}>
        <Button variant='contained' size='small' type='button' color='primary' onClick={getPrev} disabled={page === 1 ? true : false}>Previous</Button>
        <span style={{ marginLeft: 10, marginRight: 10 }}>{page}</span>
        <Button variant='contained' size='small' type='button' color='primary' onClick={getNext} disabled={isLastPage ? true : false}>Next</Button>
      </div> */}
      </div>
    </>
  );
};

export default LorryReceipts;
