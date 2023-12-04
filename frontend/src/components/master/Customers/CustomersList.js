import { useEffect, useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Stack } from '@mui/material';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import LoadingSpinner from '../../UI/LoadingSpinner';
import Dialog from '../../UI/Dialog';

import { getCustomers, removeCustomer } from '../../../lib/api-master';
import { checkAuth } from '../../../lib/RequireAuth';

const CustomersList = () => {
  const columns = [
    { field: '_id', headerName: 'Id' },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
    { field: 'phone', headerName: 'Contact No', flex: 1 },
    {
      field: 'actions', headerName: '', flex: 1, sortable: false, renderCell: (params) => {
        const triggerEdit = (e) => {
          e.stopPropagation();
          return navigateToEdit(params.row._id);
        };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteCustomer(params.row._id);
        }

        return <>
          <IconButton size='small' onClick={triggerEdit} color='primary'><EditIcon /></IconButton>&nbsp;&nbsp;
          <IconButton size='small' onClick={triggerDelete} color='error'><DeleteIcon /></IconButton>
        </>;
      }
    }
  ];

  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [httpError, setHttpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUnauth, setIsUnauth] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const controller = new AbortController();

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

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    if (deleteCustomerId) {
      setIsLoading(true);
      removeCustomer(deleteCustomerId, controller)
        .then(response => {
          setIsLoading(false);
          setDeleteCustomerId('');
          const updatedCustomers = customers.filter(article => article._id !== response.id);
          setCustomers(updatedCustomers);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [deleteCustomerId, customers]);

  const handleAddCustomer = () => {
    navigate('/master/customers/addCustomer');
  };

  const navigateToEdit = (id) => {
    if (checkAuth('master', 'customers', 'write')) {
      navigate('/master/customers/editCustomer', { state: { customerId: id } });
    } else {
      setIsUnauth(true);
    }
  };

  const deleteCustomer = (id) => {
    if (checkAuth('master', 'customers', 'write')) {
      setSelectedId(id);
      setIsDialogOpen(true);
    } else {
      setIsUnauth(true);
    }
  };

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === 'true') {
      setDeleteCustomerId(selectedId);
    } else {
      setSelectedId('');
    }
    setIsDialogOpen(false);
  };

  const handleUnauthClose = () => {
    setIsUnauth(false);
  }

  return <>
    {isLoading && <LoadingSpinner />}

    {isDialogOpen && <Dialog isOpen={true} onClose={handleDialogClose} title='Are you sure?' content='Do you want to delete the customer?' warning />}
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={isUnauth} autoHideDuration={6000} onClose={handleUnauthClose}>
      <Alert severity="warning">You are not authorized to perform the action</Alert>
    </Snackbar>

    <div className='page_head'>
      <h1 className='pageHead'>Customers list</h1>
      <div className='page_actions'>
        <Button variant='contained' size='small' type='button' color='primary' className='ml6' onClick={handleAddCustomer}>Add a customer</Button>
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
        rows={customers}
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

export default CustomersList;