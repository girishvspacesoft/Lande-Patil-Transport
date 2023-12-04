import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { getFormattedDate, getFormattedLSNumber } from "../../../lib/helper";

const PaymentCollectionHistory = ({ bills }) => {
  const [updatedBills, setUpdatedBills] = useState([]);

  useEffect(() => {
    setUpdatedBills(() => {
      return getUpdatedBills(bills);
    });
  }, [bills]);

  const getUpdatedBills = (bills) => {
    const updatedBills = [];
    if (bills.length) {
      bills.forEach((bill, billIndex) => {
        if (bill.paymentCollection.length) {
          bill.paymentCollection.forEach((collection, collectionIndex) => {
            const history = {};
            history._id = `${billIndex}_${collectionIndex}`;
            history.billNo = getFormattedLSNumber(bill.billNo);
            history.billDate = getFormattedDate(bill.date);
            history.billAmount = bill.total.toFixed(2);
            history.receivingDate = getFormattedDate(collection.receivingDate);
            history.receivedAmout = collection.receive.toFixed(2);
            history.tds = collection.tds ? collection.tds.toFixed(2) : 0.00;
            history.extra = collection.extra ? collection.extra.toFixed(2) : 0.00;
            history.payMode = collection.payMode;
            history.reverse = collection.reverse ? -(collection.reverse.toFixed(2)) : 0.00;
            updatedBills.push(history);
          });
        }
      });
    }
    return updatedBills;
  };

  const columns = [
    { field: '_id', headerName: 'Id' },
    { field: 'billNo', headerName: 'Bill no.', flex: 1, },
    { field: 'billDate', headerName: 'Bill date', flex: 1 },
    { field: 'billAmount', headerName: 'Total bill amount', type: 'number', flex: 1 },
    { field: 'receivedAmout', headerName: 'Receiving amount', type: 'number', flex: 1 },
    { field: 'tds', headerName: 'TDS', type: 'number', flex: 1 },
    { field: 'extra', headerName: 'Extra', type: 'number', flex: 1 },
    {
      field: 'reverse', headerName: 'Reversed', type: 'number', flex: 1, cellClassName: (params) => {
        return params.row.reverse < 0 ? 'red_highlight' : '';
      }
    },
    { field: 'payMode', headerName: 'Payment mode', flex: 1 },
    { field: 'receivingDate', headerName: 'Receiving date', flex: 1 }
  ];
  return <>
    <h2 className='mb20'>Collection history</h2>
    <DataGrid
      sx={{ backgroundColor: 'primary.contrastText' }}
      autoHeight
      density='standard'
      getRowId={(row) => row._id}
      rows={updatedBills}
      columns={columns}
      initialState={{
        ...columns,
        columns: {
          columnVisibilityModel: {
            _id: false
          },
        },
      }}
      pageSize={10}
      rowsPerPageOptions={[10]}
      disableSelectionOnClick
    />
  </>
};

export default PaymentCollectionHistory;