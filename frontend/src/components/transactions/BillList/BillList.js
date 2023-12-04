import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Alert, Stack, InputLabel, MenuItem, FormControl, Button } from '@mui/material';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

import LoadingSpinner from '../../UI/LoadingSpinner';
import CustomDialog from '../../UI/Dialog';

import { getBranches, getCustomers } from '../../../lib/api-master';
import { getBills, removeBill } from '../../../lib/api-transactions';
import { getFormattedDate, getFormattedLSNumber } from '../../../lib/helper';

const BillList = () => {

  const columns = [
    { field: '_id', headerName: 'Id' },
    {
      field: 'billNo', headerName: 'Bill no.', flex: 1, renderCell: (params) => {
        return getFormattedLSNumber(params.row.billNo);
      }
    },
    {
      field: 'date', headerName: 'Date', flex: 1, renderCell: (params) => {
        return getFormattedDate(new Date(params.row.date));
      }
    },
    {
      field: 'customer', headerName: 'Customer', flex: 1, renderCell: (params) => {
        return params.row.customer.name ? params.row.customer.name : params.row.customer;
      }
    },
    {
      field: 'total', headerName: 'Bill amount', flex: 1, renderCell: (params) => {
        return <strong>₹ {params.row.total.toFixed(2)}</strong>;
      }
    },
    {
      field: 'actions', headerName: '', flex: 1, sortable: false, renderCell: (params) => {
        const triggerView = (e) => {
          e.stopPropagation();
          console.log('View bill');
          //viewLR(params.row._id);
        };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteBill(params.row._id);
        };

        const triggerEdit = (e) => {
          e.stopPropagation();
          return navigateToEdit(params.row._id);
        };

        return <>
          <IconButton size='small' onClick={triggerView} color='primary'><VisibilityIcon /></IconButton>
          <IconButton size='small' onClick={triggerEdit} color='primary'><EditIcon /></IconButton>
          <IconButton size='small' onClick={triggerDelete} color='error'><DeleteIcon /></IconButton>
        </>;
      }
    }
  ];

  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [deleteBillId, setDeleteBillId] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    getBranches(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setBranches(response);
          if (response.length) {
            const filteredBranch = response.filter(branch => {
              return branch.name.toLowerCase() === 'camp'
            });
            if (filteredBranch.length) {
              setSelectedBranch(filteredBranch[0]);
            }
          }
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setHttpError('Something went wrong! Please try later or contact Administrator.');
      });

    setIsLoading(true);
    getCustomers(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setCustomers(response);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setHttpError('Something went wrong! Please try later or contact Administrator.');
      });

  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (selectedBranch?._id && customers.length) {
      setIsLoading(true);
      getBills(selectedBranch._id, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message)
          } else {
            const updatedBills = response.map(bill => {
              const customer = customers.filter(customer => customer._id === bill.customer)[0];
              return {
                ...bill,
                customer: customer
              }
            });
            setBills(updatedBills);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setHttpError(error.message);
          setIsLoading(false);
        });
    }

    return () => {
      controller.abort();
    };
  }, [selectedBranch, customers]);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    if (deleteBillId) {
      removeBill(deleteBillId, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message)
          } else {
            setBills(currState => {
              return currState.filter(bill => bill._id !== response.id);
            });
          }
          setIsLoading(false);
        })
        .catch(error => {
          setHttpError(error.message);
          setIsLoading(false);
        });
    }

    return () => {
      controller.abort();
    };
  }, [deleteBillId]);

  const branchChangeHandler = (e) => {
    const filteredBranch = branches.filter(branch => branch._id === e.target.value);
    setSelectedBranch(filteredBranch[0]);
  };

  const deleteBill = (id) => {
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === 'true') {
      setDeleteBillId(selectedId);
    } else {
      setDeleteBillId('');
      setSelectedId('');
    }
    setIsDialogOpen(false);
  };

  const handleAddBill = () => {
    navigate('/transactions/billList/addBill');
  };

  const navigateToEdit = (id) => {
    navigate('/transactions/billList/editBill', { state: { billId: id } });
  };

  return <>
    {isLoading && <LoadingSpinner />}

    {isDialogOpen && <CustomDialog isOpen={true} onClose={handleDialogClose} title='Are you sure?' content='Do you want to delete the bill' warning />}

    <div className='page_head'>
      <h1 className='pageHead'>Bills</h1>
      <div className='page_actions'>
        {selectedBranch && <FormControl size='small' sx={{ width: '150px', marginRight: '5px' }} >
          <InputLabel id='branch'>Select branch</InputLabel>
          <Select
            labelId='branch'
            name='branch'
            label='Select branch'
            value={selectedBranch._id}
            onChange={branchChangeHandler}
          >
            {branches.length > 0 && branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
          </Select>
        </FormControl>}
        <Button variant='contained' size='small' type='button' color='primary' className='ml6' onClick={handleAddBill}>Add a bill</Button>
      </div>
    </div>

    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}

    <div style={{ width: '100%' }}>
      <DataGrid
        sx={{ backgroundColor: 'primary.contrastText' }}
        autoHeight
        density='compact'
        getRowId={(row) => row._id}
        rows={bills}
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

  </>;
};

export default BillList;