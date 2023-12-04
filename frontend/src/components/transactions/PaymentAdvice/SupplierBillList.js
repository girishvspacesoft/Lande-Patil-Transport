import { useState, useEffect } from 'react';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper, Divider, InputAdornment, Autocomplete } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { getSupplierBills, updateSupplierBills } from '../../../lib/api-transactions';
import { getFormattedDate } from '../../../lib/helper';

const SupplierBillList = ({ selectedSupplier, triggerFetch, setTriggerFetch }) => {

  const user = useSelector(state => state.user);
  const [supplierBills, setSupplierBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const columns = [
    { field: '_id', headerName: 'Id' },
    {
      field: 'date', headerName: 'Date', flex: 1, renderCell: (params) => {
        return getFormattedDate(new Date(params.row.createdAt));
      }
    },
    {
      field: 'invoiceDate', headerName: 'Invoice date', flex: 1, renderCell: (params) => {
        return getFormattedDate(new Date(params.row.createdAt));
      }
    },
    { field: 'invoiceNo', headerName: 'Invoice no' },
    { field: 'supplyName', headerName: 'Supply name' },
    { field: 'quantity', headerName: 'Quantity' },
    {
      field: 'amount', headerName: 'Bill amount', flex: 1, type: 'number', renderCell: (params) => {
        return <strong>₹ {params.row.amount.toFixed(2)}</strong>;
      }
    },
    {
      field: 'paid', headerName: 'Paid', flex: 1, type: 'number', renderCell: (params) => {
        return <strong>₹ {params.row.paid.toFixed(2)}</strong>;
      }
    },
    {
      field: 'balance', headerName: 'Balance', flex: 1, type: 'number', renderCell: (params) => {
        return <strong>₹ {params.row.balance.toFixed(2)}</strong>;
      }
    },
    {
      field: 'pay', headerName: 'Pay', flex: 1, renderCell: (params) => {
        return <FormControl fullWidth className='tableTextfield'>
          <TextField size='small' variant='outlined' value={params.row.pay} onChange={inputChangeHandler.bind(null, 'pay')} name={params.row._id} id={`${params.row._id}_pay`} InputProps={{
            startAdornment: <InputAdornment position='start'>&#8377;</InputAdornment>
          }} disabled={params.row.balance === 0} />
        </FormControl>;
      }
    },
  ];

  useEffect(() => {
    const controller = new AbortController();
    if (selectedSupplier && triggerFetch) {
      setIsLoading(true);
      getSupplierBills(selectedSupplier, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            const updatedResponse = response.map(bill => {
              const paid = bill.payments.reduce(((total, payment) => {
                return total + payment.paid;
              }), 0);
              bill.paid = paid;
              bill.pay = 0;
              bill.balance = bill.amount - paid;
              return bill;
            })
            setSupplierBills(updatedResponse);
            setTriggerFetch(false);
          }
          setIsLoading(false);
        })
        .catch(e => {
          setIsLoading(false);
          setHttpError(e.message);
        });
    }

    return () => {
      controller.abort();
    };
  }, [selectedSupplier, setTriggerFetch, triggerFetch]);

  useEffect(() => {
    const controller = new AbortController();
    if (isSubmitted && supplierBills.length) {
      const filteredBills = supplierBills.filter(bill => bill.pay).map(bill => {
        return {
          _id: bill._id,
          paid: bill.pay,
          date: new Date(),
          createdBy: user._id
        };
      });
      if (filteredBills.length) {
        updateSupplierBills(filteredBills, controller)
          .then(response => {
            if (response.message) {
              setHttpError(response.message);
            } else {
              setHttpError('');
              const updatedResponse = response.map(bill => {
                const paid = bill.payments.reduce(((total, payment) => {
                  return total + payment.paid;
                }), 0);
                bill.paid = paid;
                bill.pay = 0;
                bill.balance = bill.amount - paid;
                return bill;
              })
              setSupplierBills(updatedResponse);
            }
            setIsSubmitted(false);
            setIsLoading(false);
            setTriggerFetch(true);
          })
          .catch(e => {
            setIsLoading(false);
            setIsSubmitted(false);
            setHttpError(e.message);
          });
      }
      setIsLoading(true);
    }

    return () => {
      controller.abort();
    };
  }, [isSubmitted, supplierBills, user._id, setTriggerFetch]);

  const inputChangeHandler = (type, e) => {
    if (type === 'pay') {
      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
    }
    const name = e.target.name;
    const value = e.target.value;
    setSupplierBills(currState => {
      const updatedState = [...currState];
      updatedState.forEach(bill => {
        if (bill._id === name) {
          if (type === 'pay') {
            bill.pay = +value;
          }
        }
      });
      return updatedState;
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return <>
    <form action='' onSubmit={submitHandler}>
      <DataGrid
        sx={{ backgroundColor: 'primary.contrastText' }}
        autoHeight
        density='standard'
        getRowId={(row) => row._id}
        rows={supplierBills}
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
      <div className='right'>
        <Button variant='contained' size='medium' type='submit' color='primary' className='ml6'>Save</Button>
      </div>
    </form>
  </>
};

export default SupplierBillList;