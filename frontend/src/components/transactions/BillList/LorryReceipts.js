import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Button, Divider } from '@mui/material';

import { getFormattedDate, getFormattedLRNumber } from '../../../lib/helper';

const LorryReceipts = ({ lorryReceipts, setLRForBill, bill, setBill }) => {

  const getDescription = lr => {
    return `${lr.from} to ${lr.to}`;
  };

  const getArticleOrWeight = lr => {
    return lr.transactions.reduce((total, current) => { return total + +current.articleNo; }, 0);
  };

  const columns = [
    { field: '_id', headerName: 'Id' },
    {
      field: 'lrNo', headerName: 'LR no.', flex: 1, renderCell: (params) => {
        return getFormattedLRNumber(params.row.lrNo);
      }
    },
    {
      field: 'description', headerName: 'Description', flex: 1, renderCell: (params) => {
        return getDescription(params.row);
      }
    },
    {
      field: 'articles', headerName: 'Articles', flex: 1, renderCell: (params) => {
        return getArticleOrWeight(params.row);
      }
    },
    {
      field: 'wayBillNo', headerName: 'Way bill no & date', flex: 1, renderCell: (params) => {
        return `${params.row.wayBillNo} ${getFormattedDate(params.row.date)}`;
      }
    },
    { field: 'invoiceNo', headerName: 'Memo no.', flex: 1 },
    { field: 'vehicleNo', headerName: 'Vehicle no', flex: 1 },
    {
      field: 'total', headerName: 'Amount', flex: 1, renderCell: (params) => {
        return <strong>₹ {Number(params.row.total).toFixed(2)}</strong>;
      }
    }
  ];

  const [selectedLR, setSelectedLR] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    setBill(currState => {
      return {
        ...currState,
        lrList: [...selectedLR]
      };
    });
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.checked;
    const updatedLR = lorryReceipts.map(lr => {
      if (lr._id === name) {
        lr.checked = value
      }
      return lr;
    });
    setSelectedLR(updatedLR.filter(lr => lr.checked));
  };

  return <>
    <h3 className='mb20'>Lorry receipts</h3>
    <form action='' onSubmit={submitHandler} id='lrSelectionForm'>
      {lorryReceipts.length === 0 && <p>No lorry receipts found for billing!</p>}
      <FormGroup className='checkboxGroup'>
        {lorryReceipts.length > 0 && lorryReceipts.map(lr => <FormControlLabel className='groupCheckbox' key={lr.lrNo} control={<Checkbox name={lr._id} size="small" checked={lr.checked} onChange={inputChangeHandler} />} label={<span style={{ fontSize: '0.9em', display: 'inline-block', lineHeight: '1em' }}>{getFormattedLRNumber(lr.lrNo)}</span>} />)}
      </FormGroup>
      <div className='right'>
        <Button variant='contained' size='medium' type='submit' color='primary' form='lrSelectionForm' className='ml6'>Update</Button>
      </div>
    </form>
    <Divider sx={{ margin: '20px 0' }} />
    <DataGrid
      sx={{ backgroundColor: 'primary.contrastText' }}
      autoHeight
      density='compact'
      getRowId={(row) => row._id}
      rows={bill.lrList}
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

export default LorryReceipts;