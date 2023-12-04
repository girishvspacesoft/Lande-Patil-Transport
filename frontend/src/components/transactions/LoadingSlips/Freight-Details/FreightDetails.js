import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Button, Divider } from '@mui/material';

import { getFormattedLRNumber } from '../../../../lib/helper';

const FreightDetails = ({ loadingSlip, setLoadingSlip, customers, lorryReceipts }) => {
  const columns = [
    { field: '_id', headerName: 'Id' },
    {
      field: 'lrNo', headerName: 'LR no.', flex: 1, renderCell: (params) => {
        return getFormattedLRNumber(params.row.lrNo);
      }
    },
    {
      field: 'consignor', headerName: 'Consignor', flex: 1, renderCell: (params) => {
        return params.row.consignor.name;
      }
    },
    { field: 'from', headerName: 'From', flex: 1 },
    {
      field: 'consignee', headerName: 'Consignee', flex: 1, renderCell: (params) => {
        return params.row.consignee.name;
      }
    },
    { field: 'to', headerName: 'To', flex: 1 },
    { field: 'weight', headerName: 'Weight', flex: 1 },
    {
      field: 'total', headerName: 'To pay', flex: 1, renderCell: (params) => {
        return <strong>₹ {Number(params.row.total).toFixed(2)}</strong>;
      }
    }
  ];

  const [filteredLR, setFilteredLR] = useState([]);
  const [selectedLR, setSelectedLR] = useState([]);

  useEffect(() => {
    if (lorryReceipts.length) {
      const updatedLorryReceipts = [...lorryReceipts];
      updatedLorryReceipts.forEach(lr => {
        let weight = 0;
        lr.consignor = customers.filter(customer => customer._id === lr.consignor)[0];
        lr.consignee = customers.filter(customer => customer._id === lr.consignee)[0];
        lr.transactions.forEach(transaction => {
          weight += +transaction.weight;
        });
        lr.weight = weight;
        lr.checked = false;
      });
      setFilteredLR(updatedLorryReceipts.filter(lr => lr.status === 0));
    }
  }, [lorryReceipts, customers]);

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.checked;
    const updatedLR = filteredLR.map(lr => {
      if (lr._id === name) {
        lr.checked = value
      }
      return lr
    });
    setFilteredLR(updatedLR);
  };

  useEffect(() => {
    setLoadingSlip(currState => {
      return {
        ...currState,
        lrList: [...selectedLR]
      };
    });
  }, [selectedLR, setLoadingSlip]);

  const submitHandler = (e) => {
    e.preventDefault();
    setSelectedLR(filteredLR.filter(lr => lr.checked));
  };


  return (
    <>
      <h3 className='mb20'>Lorry receipts</h3>
      <form action='' onSubmit={submitHandler} id='lrSelectionForm'>
        <FormGroup className='checkboxGroup'>
          {filteredLR.length > 0 && filteredLR.map(lr => <FormControlLabel className='groupCheckbox' key={lr.lrNo} control={<Checkbox name={lr._id} size="small" checked={lr.checked} onChange={inputChangeHandler} />} label={<span style={{ fontSize: '0.9em', display: 'inline-block', lineHeight: '1em' }}>{getFormattedLRNumber(lr.lrNo)}</span>} />)}
        </FormGroup>
      </form>
      <div className='right'>
        <Button variant='contained' size='medium' type='submit' color='primary' form='lrSelectionForm' className='ml6'>Update</Button>
      </div>
      <Divider sx={{ margin: '20px 0' }} />
      <div style={{ width: '100%' }}>
        <DataGrid
          sx={{ backgroundColor: 'primary.contrastText' }}
          autoHeight
          density='compact'
          getRowId={(row) => row._id}
          rows={loadingSlip.lrList}
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
      </div>
    </>
  );
};

export default FreightDetails;