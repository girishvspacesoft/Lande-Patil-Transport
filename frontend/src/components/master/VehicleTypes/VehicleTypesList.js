import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Alert, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { getVehicleTypes, removeVehicleType } from '../../../lib/api-master';
import { checkAuth } from '../../../lib/RequireAuth';

import Dialog from '../../UI/Dialog';
import LoadingSpinner from '../../UI/LoadingSpinner';

const VehicleTypesList = () => {
  const columns = [
    { field: '_id', headerName: 'Id' },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'tyreQuantity', headerName: 'Tyre quantity', flex: 1 },
    {
      field: 'actions', headerName: '', flex: 1, sortable: false, renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          return navigateToEdit(params.row._id);
        };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteVehicleType(params.row._id);
        }

        return <>
          <IconButton size='small' onClick={onClick} color='primary'><EditIcon /></IconButton>&nbsp;&nbsp;
          <IconButton size='small' onClick={triggerDelete} color='error'><DeleteIcon /></IconButton>
        </>;
      }
    }
  ];

  const navigate = useNavigate();
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [httpError, setHttpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteVehicleTypeId, setDeleteVehicleTypeId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [isUnauth, setIsUnauth] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    getVehicleTypes(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setVehicleTypes(response);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setHttpError('Something went wrong! Please try later or contact Administrator.');
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    if (deleteVehicleTypeId) {
      setIsLoading(true);
      removeVehicleType(deleteVehicleTypeId, controller)
        .then(response => {
          setIsLoading(false);
          setDeleteVehicleTypeId('');
          const updatedVehicleTypes = vehicleTypes.filter(place => place._id !== response.id);
          setVehicleTypes(updatedVehicleTypes);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [deleteVehicleTypeId, vehicleTypes]);

  const handleAddVehicleType = () => {
    navigate('/master/vehicleTypes/addVehicleType');
  };

  const navigateToEdit = (id) => {
    if (checkAuth('master', 'vehicleTypes', 'write')) {
      navigate('/master/vehicleTypes/editVehicleType', { state: { vehicleTypeId: id } });
    } else {
      setIsUnauth(true);
    }
  };

  const deleteVehicleType = (id) => {
    if (checkAuth('master', 'vehicleTypes', 'write')) {
      setSelectedId(id);
      setIsDialogOpen(true);
    } else {
      setIsUnauth(true);
    }
  };

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === 'true') {
      setDeleteVehicleTypeId(selectedId);
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

    {isDialogOpen && <Dialog isOpen={true} onClose={handleDialogClose} title='Are you sure?' content='Do you want to delete the vehicle type?' />}
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={isUnauth} autoHideDuration={6000} onClose={handleUnauthClose}>
      <Alert severity="warning">You are not authorized to perform the action</Alert>
    </Snackbar>

    <div className='page_head'>
      <h1 className='pageHead'>Vehicle types</h1>
      <div className='page_actions'>
        <Button variant='contained' size='small' type='button' color='primary' className='ml6' onClick={handleAddVehicleType}>Add a vehicle type</Button>
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
        rows={vehicleTypes}
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

export default VehicleTypesList;