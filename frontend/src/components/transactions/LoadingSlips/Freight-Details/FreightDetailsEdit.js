import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Button, Divider } from '@mui/material';

import { getFormattedLRNumber } from '../../../../lib/helper';

const FreightDetailsEdit = ({ loadingSlip, setLoadingSlip, customers, lorryReceipts, setLorryReceipts, handleSelectedLr }) => {
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

  const [initial, setInitial] = useState(true);
  const [updatedLR, setUpdatedLR] = useState([]);
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
      });

      setUpdatedLR(updatedLorryReceipts);
    }
  }, [lorryReceipts, customers]);

  useEffect(() => {
    if (updatedLR.length && initial) {
      setSelectedLR(updatedLR.filter(lr => lr.checked));
      setInitial(false);
    }
  }, [updatedLR, initial]);

  useEffect(() => {
    handleSelectedLr(selectedLR);
  }, [selectedLR, handleSelectedLr]);


  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.checked;
    setUpdatedLR(currState => {
      const updatedState = [...currState];
      updatedState.forEach(lr => {
        if (lr._id === name) {
          lr.checked = value;
        }
      });
      return updatedState;
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setSelectedLR(updatedLR.filter(lr => lr.checked));
  };

  return (
    <>
      <h3 className='mb20'>Lorry receipts</h3>
      <form action='' onSubmit={submitHandler} id='lrSelectionForm'>
        <FormGroup className='checkboxGroup'>
          {updatedLR.length > 0 && updatedLR.map(lr => <FormControlLabel className='groupCheckbox' key={lr.lrNo} control={<Checkbox name={lr._id} size="small" checked={lr.checked} onChange={inputChangeHandler} />} label={<span style={{ fontSize: '0.9em', display: 'inline-block', lineHeight: '1em' }}>{getFormattedLRNumber(lr.lrNo)}</span>} />)}
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
          rows={selectedLR}
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

export default FreightDetailsEdit;