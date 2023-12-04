import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Stack } from '@mui/material';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import LoadingSpinner from '../../UI/LoadingSpinner';
import Dialog from '../../UI/Dialog';

import { getSuppliers, getVehicles, removeVehicle, getVehicleTypes } from '../../../lib/api-master';
import { checkAuth } from '../../../lib/RequireAuth';

const VehiclesList = () => {
  const columns = [
    { field: '_id', headerName: 'Id' },
    { field: 'vehicleNo', headerName: 'Vehicle no', flex: 1 },
    { field: 'ownerName', headerName: 'Owner', flex: 1 },
    { field: 'ownerAddress', headerName: 'Owner address', flex: 1 },
    { field: 'vehicleType', headerName: 'Vehicle type', flex: 1 },
    {
      field: 'actions', headerName: '', flex: 1, sortable: false, renderCell: (params) => {
        const triggerEdit = (e) => {
          e.stopPropagation();
          return navigateToEdit(params.row._id);
        };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteVehicle(params.row._id);
        }

        return <>
          <IconButton size='small' onClick={triggerEdit} color='primary'><EditIcon /></IconButton>&nbsp;&nbsp;
          <IconButton size='small' onClick={triggerDelete} color='error'><DeleteIcon /></IconButton>
        </>;
      }
    }
  ];

  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [httpError, setHttpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [isUnauth, setIsUnauth] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getVehicles(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setVehicles(response);
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
    if (vehicles.length) {
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
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    }
    return () => {
      controller.abort();
    };
  }, [vehicles]);

  useEffect(() => {
    const controller = new AbortController();

    if (vehicles.length) {
      getSuppliers(controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setSuppliers(response);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    }

    return () => {
      controller.abort();
    };
  }, [vehicles]);

  useEffect(() => {
    const controller = new AbortController();

    if (deleteVehicleId) {
      setIsLoading(true);
      removeVehicle(deleteVehicleId, controller)
        .then(response => {
          setIsLoading(false);
          setDeleteVehicleId('');
          const updatedVehicles = vehicleList.filter(vehicle => vehicle._id !== response.id);
          setVehicleList(updatedVehicles);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [deleteVehicleId, vehicleList]);


  useEffect(() => {
    let updatedVahicles;
    if (vehicles.length && vehicleTypes.length && suppliers.length) {
      updatedVahicles = [...vehicles];
      updatedVahicles.forEach(vehicle => {
        const vehicleType = vehicleTypes.filter(vehicleType => vehicleType._id === vehicle.vehicleType);
        const supplier = suppliers.filter(supplier => supplier._id === vehicle.owner);
        if (vehicleType.length) {
          vehicle.vehicleType = vehicleType[0].type;
        }
        if (supplier.length) {
          vehicle.ownerName = supplier[0].name;
          vehicle.ownerAddress = supplier[0].address;
        }
      });
      setVehicleList(updatedVahicles);
    }
  }, [vehicles, suppliers, vehicleTypes]);

  const handleAddVehicle = () => {
    navigate('/master/vehicles/addVehicle');
  };

  const navigateToEdit = (id) => {
    if (checkAuth('master', 'vehicles', 'write')) {
      navigate('/master/vehicles/editVehicle', { state: { vehicleId: id } });
    } else {
      setIsUnauth(true);
    }
  };

  const deleteVehicle = (id) => {
    if (checkAuth('master', 'vehicles', 'write')) {
      setSelectedId(id);
      setIsDialogOpen(true);
    } else {
      setIsUnauth(true);
    }
  };

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === 'true') {
      setDeleteVehicleId(selectedId);
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

    {isDialogOpen && <Dialog isOpen={true} onClose={handleDialogClose} title='Are you sure?' content='Do you want to delete the vehicle?' warning />}
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={isUnauth} autoHideDuration={6000} onClose={handleUnauthClose}>
      <Alert severity="warning">You are not authorized to perform the action</Alert>
    </Snackbar>

    <div className='page_head'>
      <h1 className='pageHead'>Vehicles list</h1>
      <div className='page_actions'>
        <Button variant='contained' size='small' type='button' color='primary' className='ml6' onClick={handleAddVehicle}>Add a vehicle</Button>
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
        rows={vehicleList}
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

export default VehiclesList;