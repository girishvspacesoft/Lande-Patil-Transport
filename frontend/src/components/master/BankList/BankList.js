import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Alert, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import LoadingSpinner from '../../UI/LoadingSpinner';
import Dialog from '../../UI/Dialog';

import { getBanks, removeBank } from '../../../lib/api-master';
import { checkAuth } from '../../../lib/RequireAuth';

const BankList = () => {

  const columns = [
    { field: '_id', headerName: 'Id' },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'branchName', headerName: 'Branch name', flex: 1 },
    { field: 'branchCode', headerName: 'Branch code', flex: 1 },
    { field: 'ifsc', headerName: 'IFSC', flex: 1 },
    { field: 'micr', headerName: 'MICR', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'email', headerName: 'email', flex: 1 },
    {
      field: 'actions', headerName: '', flex: 1, sortable: false, renderCell: (params) => {
        const triggerEdit = (e) => {
          e.stopPropagation();
          return navigateToEdit(params.row._id);
        };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteArticle(params.row._id);
        }

        return <>
          <IconButton size='small' onClick={triggerEdit} color='primary'><EditIcon /></IconButton>&nbsp;&nbsp;
          <IconButton size='small' onClick={triggerDelete} color='error'><DeleteIcon /></IconButton>
        </>;
      }
    }
  ];

  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [httpError, setHttpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteBankId, setDeleteBankId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [isUnauth, setIsUnauth] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getBanks(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setBanks(response);
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

    if (deleteBankId) {
      setIsLoading(true);
      removeBank(deleteBankId, controller)
        .then(response => {
          setIsLoading(false);
          setDeleteBankId('');
          const updatedArticles = banks.filter(bank => bank._id !== response.id);
          setBanks(updatedArticles);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [deleteBankId, banks]);

  const handleAddBank = () => {
    navigate('/master/banks/addBank');
  };

  const navigateToEdit = (id) => {
    if (checkAuth('master', 'banks', 'write')) {
      navigate('/master/banks/editBank', { state: { bankId: id } });
    } else {
      setIsUnauth(true);
    }
  };

  const deleteArticle = (id) => {
    if (checkAuth('master', 'banks', 'write')) {
      setSelectedId(id);
      setIsDialogOpen(true);
    } else {
      setIsUnauth(true);
    }
  };

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === 'true') {
      setDeleteBankId(selectedId);
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

    {isDialogOpen && <Dialog isOpen={true} onClose={handleDialogClose} title='Are you sure?' content='Do you want to delete the bank?' warning />}
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={isUnauth} autoHideDuration={6000} onClose={handleUnauthClose}>
      <Alert severity="warning">You are not authorized to perform the action</Alert>
    </Snackbar>

    <div className='page_head'>
      <h1 className='pageHead'>Bank list</h1>
      <div className='page_actions'>
        <Button variant='contained' size='small' type='button' color='primary' className='ml6' onClick={handleAddBank}>Add a bank</Button>
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
        rows={banks}
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

export default BankList;