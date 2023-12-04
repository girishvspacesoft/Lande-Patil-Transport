import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getFormattedDate, getFormattedLRNumber } from "../../../lib/helper";

const PaymentAdviceHistory = ({ selectedLR, setSelectedLR }) => {
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
        return getFormattedDate(new Date(params.row.date));
      },
    },
    {
      field: "amount",
      headerName: "Paid",
      type: "number",
      renderCell: (params) => {
        return params.row.amount ? (
          <strong>₹ {params.row.amount.toFixed(2)}</strong>
        ) : null;
      },
    },
  ];

  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    if (selectedLR && selectedLR.paymentAdvice.length) {
      const historyList = [];
      selectedLR.paymentAdvice.forEach((payment, index) => {
        historyList.push({
          _id: "payment_" + index,
          date: payment.addedOn,
          lrNo: selectedLR.lrNo,
          amount: payment.amount,
        });
      });
      setPaymentHistory(historyList);
    } else {
      setPaymentHistory([]);
    }
  }, [selectedLR]);

  return (
    <>
      <h2 className="mb10">Payment history</h2>

      <DataGrid
        sx={{ backgroundColor: "primary.contrastText" }}
        autoHeight
        density="standard"
        getRowId={(row) => row._id}
        rows={paymentHistory}
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
    </>
  );
};

export default PaymentAdviceHistory;
