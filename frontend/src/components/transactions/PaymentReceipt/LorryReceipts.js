import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Button, Divider } from "@mui/material";

import { getFormattedDate, getFormattedLRNumber } from "../../../lib/helper";

const LorryReceipts = ({
  lorryReceipts,
  setLRForPR,
  paymentReceipt,
  setPaymentReceipt,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const getDescription = (lr) => {
    return `${lr.from} to ${lr.to}`;
  };

  const getTotalByType = (lr, type) => {
    return lr.transactions.reduce((total, current) => {
      return total + +current[type];
    }, 0);
  };

  const columns = [
    { field: "_id", headerName: "Id" },
    {
      field: "lrNo",
      headerName: "LR no.",
      flex: 1,
      renderCell: (params) => {
        return getFormattedLRNumber(params.row.lrNo);
      },
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      renderCell: (params) => {
        return getDescription(params.row);
      },
    },
    {
      field: "boxQuantity",
      headerName: "Box quantity",
      type: "number",
      flex: 1,
      renderCell: (params) => {
        return getTotalByType(params.row, "boxQuantity");
      },
    },
    {
      field: "popQuantity",
      headerName: "Pop quantity",
      type: "number",
      flex: 1,
      renderCell: (params) => {
        return getTotalByType(params.row, "popQuantity");
      },
    },
    {
      field: "looseQuantity",
      headerName: "Loose quantity",
      type: "number",
      flex: 1,
      renderCell: (params) => {
        return getTotalByType(params.row, "looseQuantity");
      },
    },
    { field: "vehicleNo", headerName: "Vehicle no", flex: 1 },
  ];

  const [selectedLR, setSelectedLR] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    setPaymentReceipt((currState) => {
      return {
        ...currState,
        lrList: [...selectedLR],
      };
    });
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.checked;
    const updatedLR = lorryReceipts.map((lr) => {
      if (lr._id === name) {
        lr.checked = value;
      }
      return lr;
    });
    setSelectedLR(updatedLR.filter((lr) => lr.checked));
  };

  return (
    <>
      <h3 className="mb20">Lorry receipts</h3>
      <form action="" onSubmit={submitHandler} id="lrSelectionForm">
        {lorryReceipts.length === 0 && (
          <p>No lorry receipts found for payment receipt!</p>
        )}
        <FormGroup className="checkboxGroup">
          {lorryReceipts.length > 0 &&
            lorryReceipts.map((lr) => (
              <FormControlLabel
                className="groupCheckbox"
                key={lr.lrNo}
                control={
                  <Checkbox
                    name={lr._id}
                    size="small"
                    checked={lr.checked}
                    onChange={inputChangeHandler}
                  />
                }
                label={
                  <span
                    style={{
                      fontSize: "0.9em",
                      display: "inline-block",
                      lineHeight: "1em",
                    }}
                  >
                    {getFormattedLRNumber(lr.lrNo)}
                  </span>
                }
              />
            ))}
        </FormGroup>
        <div className="right">
          <Button
            variant="contained"
            size="medium"
            type="submit"
            color="primary"
            form="lrSelectionForm"
            className="ml6"
          >
            Update
          </Button>
        </div>
      </form>
      <Divider sx={{ margin: "20px 0" }} />
      <DataGrid
        sx={{ backgroundColor: "primary.contrastText" }}
        autoHeight
        density="compact"
        getRowId={(row) => row._id}
        rows={paymentReceipt.lrList}
        columns={columns}
        initialState={{
          ...columns,
          columns: {
            columnVisibilityModel: {
              _id: false,
            },
          },
        }}
        pageSize={limit}
        rowsPerPageOptions={[10, 50, 100]}
        disableSelectionOnClick
        onPageSizeChange={(size) => setLimit(size)}
        onPageChange={(page) => setPage(page)}
      />
    </>
  );
};

export default LorryReceipts;
