import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Alert, Stack, InputLabel, MenuItem, FormControl, Button } from '@mui/material';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import LoadingSpinner from '../../UI/LoadingSpinner';
import CustomDialog from '../../UI/Dialog';
import { getBranches } from '../../../lib/api-master';
import { getMoneyTransfers, removeMoneyTransfer } from '../../../lib/api-transactions';
import { getFormattedDate, getFormattedPettyCashNo } from '../../../lib/helper';

const MoneyTransfers = () => {
  const columns = [
    { field: '_id', headerName: 'Id' },
    {
      field: 'pettyCashNo', headerName: 'Petty cash no.', flex: 1, renderCell: (params) => {
        return getFormattedPettyCashNo(params.row.pettyCashNo);
      }
    },
    {
      field: 'transferToBranch', headerName: 'Transfer to branch', flex: 1, renderCell: (params) => {
        return getBranchNameById(params.row.transferToBranch);
      }
    },
    {
      field: 'date', headerName: 'Date', flex: 1, renderCell: (params) => {
        return getFormattedDate(new Date(params.row.date));
      }
    },
    {
      field: 'amount', headerName: 'Amount', flex: 1, renderCell: (params) => {
        return <strong>₹ {params.row.amount.toFixed(2)}</strong>;
      }
    },
    {
      field: 'actions', headerName: '', flex: 1, sortable: false, renderCell: (params) => {
        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteMT(params.row._id);
        };

        const triggerEdit = (e) => {
          e.stopPropagation();
          return navigateToEdit(params.row._id);
        };

        return <>
          <IconButton size='small' onClick={triggerEdit} color='primary'><EditIcon /></IconButton>
          <IconButton size='small' onClick={triggerDelete} color='error'><DeleteIcon /></IconButton>
        </>;
      }
    }
  ];

  const navigate = useNavigate();
  const [branches, setbranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [moneyTransfers, setMoneyTransfers] = useState([]);
  const [httpError, setHttpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteMTId, setDeleteMTId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    getBranches(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setbranches(response);
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

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (selectedBranch?._id) {
      setIsLoading(true);
      getMoneyTransfers(selectedBranch._id, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setMoneyTransfers(response);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError(error.message);
        });
    };

    return () => {
      controller.abort();
    };
  }, [selectedBranch]);

  useEffect(() => {
    const controller = new AbortController();

    if (deleteMTId) {
      setIsLoading(true);
      removeMoneyTransfer(deleteMTId, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            const filteredMoneyTransfers = moneyTransfers.filter(mt => mt._id !== response.id);
            setMoneyTransfers(filteredMoneyTransfers);
            setDeleteMTId('');
          }
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError(error.message);
        });
    };

    return () => {
      controller.abort();
    };
  }, [deleteMTId, moneyTransfers]);

  const getBranchNameById = (branchId) => {
    if (branches.length) {
      const filteredBranch = branches.filter(branch => branch._id === branchId);
      if (filteredBranch.length) {
        return filteredBranch[0].name;
      }
      return branchId;
    }
    return branchId;
  }

  const deleteMT = (id) => {
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const navigateToEdit = (id) => {
    navigate('/transactions/moneyTransfers/editMoneyTransfer', { state: { mtId: id } });
  };

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === 'true') {
      setDeleteMTId(selectedId);
    } else {
      setSelectedId('');
    }
    setIsDialogOpen(false);
  };

  const branchChangeHandler = (e) => {
    const filteredBranch = branches.filter(branch => branch._id === e.target.value);
    setSelectedBranch(filteredBranch[0]);
  };

  const handleAddMT = () => {
    navigate('/transactions/moneyTransfers/addMoneyTransfer');
  };

  return <>
    {isLoading && <LoadingSpinner />}

    {isDialogOpen && <CustomDialog isOpen={true} onClose={handleDialogClose} title='Are you sure?' content='Do you want to delete the money transfer?' warning />}

    <div className='page_head'>
      <h1 className='pageHead'>Money transfers</h1>
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
        <Button variant='contained' size='small' type='button' color='primary' className='ml6' onClick={handleAddMT}>Add a money transfer</Button>
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
        rows={moneyTransfers}
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

export default MoneyTransfers;