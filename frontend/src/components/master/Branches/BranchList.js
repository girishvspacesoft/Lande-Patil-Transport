import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Snackbar, IconButton, Alert, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { getBranches, removeBranch, getPlaces } from '../../../lib/api-master';
import { checkAuth } from '../../../lib/RequireAuth';

import Dialog from '../../UI/Dialog';
import LoadingSpinner from '../../UI/LoadingSpinner';

const Branches = () => {

  const columns = [
    { field: '_id', headerName: 'Id' },
    { field: 'branchCode', headerName: 'Code', flex: 1 },
    { field: 'abbreviation', headerName: 'Abbreviation', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'place', headerName: 'Place', flex: 1 },
    {
      field: 'actions', headerName: '', flex: 1, sortable: false, renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          return navigateToEdit(params.row._id);
        };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteBranch(params.row._id);
        }

        return <>
          <IconButton size='small' onClick={onClick} color='primary'><EditIcon /></IconButton>&nbsp;&nbsp;
          <IconButton size='small' onClick={triggerDelete} color='error'><DeleteIcon /></IconButton>
        </>;
      }
    }
  ];

  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [fetchedBranches, setFetchedBranches] = useState([]);
  const [httpError, setHttpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteBranchId, setDeleteBranchId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [isUnauth, setIsUnauth] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getBranches(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setFetchedBranches(response);
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

    if (fetchedBranches.length) {
      setIsLoading(true);
      getPlaces(controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            const updatedBranches = mapPlacesToBranches(fetchedBranches, response);
            setBranches(updatedBranches);
          }
        })
        .catch(error => {
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        }).finally(() => {
          setIsLoading(false);
        });
    };

    return () => {
      controller.abort();
    };
  }, [fetchedBranches]);

  const mapPlacesToBranches = (branches, places) => {
    const updatedBranches = branches.map(branch => {
      const place = places.filter(place => place._id === branch.place);
      if (place && place.length) {
        branch.place = place[0].name;
      }
      return branch;
    });
    return updatedBranches;
  };

  useEffect(() => {
    const controller = new AbortController();

    if (deleteBranchId) {
      setIsLoading(true);
      removeBranch(deleteBranchId, controller)
        .then(response => {
          setIsLoading(false);
          setDeleteBranchId('');
          const updatedBranches = branches.filter(branch => branch._id !== response.id);
          setBranches(updatedBranches);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [deleteBranchId, branches])

  const handleAddBranch = () => {
    navigate('/master/branches/addBranch');
  };

  const navigateToEdit = (id) => {
    if (checkAuth('master', 'branches', 'write')) {
      navigate('/master/branches/editBranch', { state: { branchId: id } });
    } else {
      setIsUnauth(true);
    }
  };

  const deleteBranch = (id) => {
    if (checkAuth('master', 'branches', 'write')) {
      setSelectedId(id);
      setIsDialogOpen(true);
    } else {
      setIsUnauth(true);
    }
  };

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === 'true') {
      setDeleteBranchId(selectedId);
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

    {isDialogOpen && <Dialog isOpen={true} onClose={handleDialogClose} title='Are you sure?' content='Do you want to delete the branch?' warning />}
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={isUnauth} autoHideDuration={6000} onClose={handleUnauthClose}>
      <Alert severity="warning">You are not authorized to perform the action</Alert>
    </Snackbar>

    <div className='page_head'>
      <h1 className='pageHead'>Branch list</h1>
      <div className='page_actions'>
        <Button variant='contained' size='small' type='button' color='primary' className='ml6' onClick={handleAddBranch}>Add a branch</Button>
      </div>
    </div>

    {
      httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
        <Alert severity='error'>{httpError}</Alert>
      </Stack>
    }

    {
      branches && branches.length > 0 && <div style={{ width: '100%' }}>
        <DataGrid
          sx={{ backgroundColor: 'primary.contrastText' }}
          autoHeight
          density='compact'
          getRowId={(row) => row._id}
          rows={branches}
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
    }
  </>;
};

export default Branches;