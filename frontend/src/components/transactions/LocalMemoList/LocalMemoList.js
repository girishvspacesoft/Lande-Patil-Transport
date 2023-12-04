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

import { getBranches, getPlaces } from '../../../lib/api-master';
import { getLoadingSlips, removeLoadingSlip } from '../../../lib/api-transactions';
import { getFormattedDate, getFormattedLSNumber } from '../../../lib/helper';

const LocalMemoList = () => {

  const columns = [
    { field: '_id', headerName: 'Id' },
    {
      field: 'lsNo', headerName: 'LS no.', flex: 1, renderCell: (params) => {
        return getFormattedLSNumber(params.row.lsNo);
      }
    },
    {
      field: 'date', headerName: 'Date', flex: 1, renderCell: (params) => {
        return getFormattedDate(new Date(params.row.createdAt));
      }
    },
    { field: 'vehicleNo', headerName: 'Vehicle no.', flex: 1 },
    {
      field: 'from', headerName: 'From', flex: 1, renderCell: (params) => {
        return params.row.from.name;
      }
    },
    {
      field: 'to', headerName: 'To', flex: 1, renderCell: (params) => {
        return params.row.to.name;
      }
    },
    {
      field: 'hire', headerName: 'Hire amount', flex: 1, renderCell: (params) => {
        return <strong>₹ {params.row.hire.toFixed(2)}</strong>;
      }
    },
    {
      field: 'total', headerName: 'Balance', flex: 1, renderCell: (params) => {
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
          return deleteLS(params.row._id);
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
  const [places, setPlaces] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loadingSlips, setLoadingSlips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [deleteLSId, setDeleteLSId] = useState('');

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

    getPlaces(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setPlaces(response);
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
    if (selectedBranch?._id && places.length) {
      setIsLoading(true);
      getLoadingSlips(selectedBranch._id, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message)
          } else {
            const updatedResponse = response.map(ls => {
              const from = places.filter(place => place._id === ls.from)[0];
              const to = places.filter(place => place._id === ls.to)[0];
              return {
                ...ls,
                from: from,
                to: to
              };
            });
            const updatedLS = updatedResponse.filter(ls => ls.isLocalMemo);
            setLoadingSlips(updatedLS);
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
  }, [selectedBranch, places]);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    if (deleteLSId) {
      removeLoadingSlip(deleteLSId, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message)
          } else {
            setLoadingSlips(currState => {
              return currState.filter(ls => ls._id !== response.id);
            })
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
  }, [deleteLSId]);

  const branchChangeHandler = (e) => {
    const filteredBranch = branches.filter(branch => branch._id === e.target.value);
    setSelectedBranch(filteredBranch[0]);
  };

  const deleteLS = (id) => {
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === 'true') {
      setDeleteLSId(selectedId);
    } else {
      setDeleteLSId('');
      setSelectedId('');
    }
    setIsDialogOpen(false);
  };

  const handleAddLS = () => {
    navigate('/transactions/localMemoList/addLocalMemoLS');
  };

  const navigateToEdit = (id) => {
    navigate('/transactions/localMemoList/editLocalMemoLS', { state: { lsId: id } });
  };

  return <>
    {isLoading && <LoadingSpinner />}

    {isDialogOpen && <CustomDialog isOpen={true} onClose={handleDialogClose} title='Are you sure?' content='Do you want to delete the loading slip?' warning />}

    <div className='page_head'>
      <h1 className='pageHead'>Local memo loading slips</h1>
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
        <Button variant='contained' size='small' type='button' color='primary' className='ml6' onClick={handleAddLS}>Add a loading slip</Button>
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
        rows={loadingSlips}
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

export default LocalMemoList;