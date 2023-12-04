import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IconButton, Alert, Stack } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

import LoadingSpinner from "../../UI/LoadingSpinner";
import { getCustomers, getDataForLR } from "../../../lib/api-master";
import {
  getAllLorryReceiptsWithCount,
  getLorryReceiptsWithCount,
  removeLorryReceiptAck,
} from "../../../lib/api-transactions";
import { getFormattedDate } from "../../../lib/helper";
import LRAcknowledgementUpload from "./LRAcknowledgementUpload";
import LRAcknowledgementView from "./LRAcknowledgementView";
import Dialog from "../../UI/Dialog";
import dayjs from "dayjs";

const LRAcknowledgement = () => {
  const columns = [
    { field: "_id", headerName: "Id" },
    { field: "wayBillNo", headerName: "LR No.", width: 100 },
    { field: "formattedDate", headerName: "Date", width: 100 },
    { field: "consignorName", headerName: "Consignor", width: 200 },
    { field: "consigneeName", headerName: "Consignee", width: 200 },
    { field: "from", headerName: "From", width: 100 },
    { field: "to", headerName: "To", width: 100 },
    { field: "vehicleNo", headerName: "Vehicle no.", width: 150 },
    {
      field: "updatedAt",
      headerName: "Update Date & Time",
      sortable: false,
      width: 200,
      // renderCell: (params) => {
        
      //   return (
      //     <>
      //       {!params.row.ack ? null : (
      //         <>                
      //           {
      //             dayjs(params.row.updatedAt).format("DD-MMM-YYYY") +"    "+ dayjs(params.row.updatedAt).format("hh:mm a")
      //           }
      //         </>
      //       )}           
      //     </>
      //   );
      // },
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      width: 120,
      renderCell: (params) => {
        const triggerSelectLR = (e) => {
          e.stopPropagation();
          setSelectedLR(params.row);
          setIsOpen(true);
        };

        const triggerDelete = (e) => {
          setSelectedDeleteId(params.row._id);
          setIsDialogOpen(true);
        };

        const triggerView = (e) => {
          setSelectedLR(params.row);
          setIsViewOpen(true);
        };

        const triggerDownload = async (e, params) => {
          e.stopPropagation();
          const ack_parts = params.row.ack.split("/");
          const ext_parts = ack_parts[ack_parts.length - 1].split(".");
          const ext = ext_parts[ext_parts.length - 1];
          const fileName = params.row.wayBillNo + "." + ext;
          const image = await fetch(params.row.ack);
          const imageBlog = await image.blob();
          const imageURL = URL.createObjectURL(imageBlog);
          const link = document.createElement("a");
          link.href = imageURL;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        return (
          <>
            {!params.row.ack ? (
              <IconButton
                size="small"
                onClick={triggerSelectLR}
                color="primary"
                title="Upload"
              >
                <UploadIcon />
              </IconButton>
            ) : (
              <>
                <IconButton
                  size="small"
                  onClick={(e) => triggerDownload(e, params)}
                  color="primary"
                >
                  <DownloadIcon />
                </IconButton>{" "}
                <IconButton
                  size="small"
                  onClick={triggerView}
                  color="primary"
                  title="View"
                >
                  <VisibilityIcon />
                </IconButton>{" "}
                <IconButton
                  size="small"
                  onClick={triggerDelete}
                  color="error"
                  title="Delete"
                >
                  <DeleteIcon />
                </IconButton>
                
              </>
            )}
          </>
        );
      },
    },
    
  ];

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [acknowledgements, setAcknowledgements] = useState([]);
  const [updatedAcknowledgements, setUpdatedAcknowledgements] = useState([]);
  const [httpError, setHttpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [getLR, setGetLR] = useState(true);
  const [selectedLR, setSelectedLR] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState("");
  const [deleteLrAckId, setDeleteLrAckId] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [filterData] = useState("");
  const [lorryReceiptsCount, setLorryReceiptsCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    if (getLR && user && user.branch) {
      setIsLoading(true);
      getLorryReceiptsWithCount(page, user.branch, limit, filterData, controller)
        .then((response) => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            
            setHttpError("");
            setAcknowledgements(response.lorryReceipts);
            setLorryReceiptsCount(response.count);
          }
          setGetLR(false);
          setIsLoading(false);
        })
        .catch((error) => {
          setGetLR(false);
          setIsLoading(false);
          setHttpError(error.message);
        });
    }
    if (
      user &&
      user.type &&
      user.type.toLowerCase() === "superadmin" &&
      getLR
    ) {
      getAllLorryReceiptsWithCount(page, limit, filterData, controller)
        .then((response) => {
          
          if (response.message) {
            setHttpError(response.message);
          } else {
            setAcknowledgements(response.lorryReceipts);
          }
          setGetLR(false);
          setIsLoading(false);
        })
        .catch((error) => {
          setGetLR(false);
          setIsLoading(false);
          setHttpError(error.message);
        });
    }
    return () => {
      controller.abort();
    };
  }, [selectedBranch, getLR, user, customers, page, limit]);

  useEffect(() => {
    const controller = new AbortController();

    if (acknowledgements.length) {
      setIsLoading(true);
      getCustomers(controller)
        .then((response) => {
          
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError("");
            const updatedLorryReceipts = acknowledgements.map(
              (lorryReceipt) => {
                const consignor = response.filter(
                  (customer) => customer._id === lorryReceipt.consignor
                );
                const consignee = response.filter(
                  (customer) => customer._id === lorryReceipt.consignee
                );
                return {
                  ...lorryReceipt,
                  consignorName: consignor.length
                    ? consignor[0].name
                    : lorryReceipt.consignor,
                  consigneeName: consignee.length
                    ? consignee[0].name
                    : lorryReceipt.consignee,
                  formattedDate: getFormattedDate(
                    new Date(lorryReceipt.createdAt)
                  ),
                  updatedAt: lorryReceipt.ack ? dayjs(lorryReceipt.updatedAt).format("DD-MMM-YYYY") +"    "+ dayjs(lorryReceipt.updatedAt).format("hh:mm a") : null,
                };
              }
            );
            const filteredLR = updatedLorryReceipts.filter((lr) => !lr.isBlank);
            setUpdatedAcknowledgements(filteredLR);
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
      setUpdatedAcknowledgements([]);
    }

    return () => {
      controller.abort();
    };
  }, [acknowledgements]);

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === "true") {
      setDeleteLrAckId(selectedDeleteId);
    } else {
      setDeleteLrAckId("");
    }
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    if (deleteLrAckId && acknowledgements.length) {
      setIsLoading(true);
      const { ack } = [...acknowledgements].find(
        (ack) => ack._id === deleteLrAckId
      );
      if (ack) {
        removeLorryReceiptAck(deleteLrAckId, ack, controller)
          .then((response) => {
            if (response.message) {
              setHttpError(response.message);
            } else {
              setGetLR(true);
              setDeleteLrAckId("");
              setSelectedDeleteId("");
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
    }
    return () => {
      controller.abort();
    };
  }, [deleteLrAckId, acknowledgements]);

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
        <h1 className="pageHead">POD</h1>
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

      <DataGrid
        sx={{ backgroundColor: "primary.contrastText" }}
        autoHeight
        density="compact"
        getRowId={(row) => row._id}
        rows={updatedAcknowledgements}
        
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
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        pageSize={limit}
        rowCount={lorryReceiptsCount}
        rowsPerPageOptions={[10, 50, 100]}
        disableSelectionOnClick
        onPageSizeChange={(size) => setLimit(size)}
        onPageChange={(page) => setPage(page)}
      />

      <LRAcknowledgementUpload
        selectedLR={selectedLR}
        setSelectedLR={setSelectedLR}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setGetLR={setGetLR}
      />
      <LRAcknowledgementView
        selectedLR={selectedLR}
        setSelectedLR={setSelectedLR}
        isViewOpen={isViewOpen}
        setIsViewOpen={setIsViewOpen}
      />
    </>
  );
};

export default LRAcknowledgement;
