import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Alert, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import LoadingSpinner from '../../UI/LoadingSpinner';
import Dialog from '../../UI/Dialog';

import { getBanks, getBankAccounts, removeBankAccount } from '../../../lib/api-master';
import { checkAuth } from '../../../lib/RequireAuth';

const BankAccountList = () => {

  const columns = [
    { field: '_id', headerName: 'Id' },
    { field: 'accountNo', headerName: 'Account number', flex: 1 },
    { field: 'accountHolder', headerName: 'Account holder', flex: 1 },
    { field: 'accountType', headerName: 'Account type', flex: 1 },
    { field: 'bank', headerName: 'Bank name', flex: 1 },
    { field: 'ifsc', headerName: 'IFSC', flex: 1 },
    { field: 'openingBalance', headerName: 'Opening balance', flex: 1 },
    {
      field: 'actions', headerName: '', flex: 1, sortable: false, renderCell: (params) => {
        const triggerEdit = (e) => {
          e.stopPropagation();
          return navigateToEdit(params.row._id);
        };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteBankAccount(params.row._id);
        }

        return <>
          <IconButton size='small' onClick={triggerEdit} color='primary'><EditIcon /></IconButton>&nbsp;&nbsp;
          <IconButton size='small' onClick={triggerDelete} color='error'><DeleteIcon /></IconButton>
        </>;
      }
    }
  ];

  const navigate = useNavigate();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankAccountList, setBankAccountList] = useState([]);
  const [httpError, setHttpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteBankAccountId, setDeleteBankAccountId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [isUnauth, setIsUnauth] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getBankAccounts(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setBankAccounts(response);
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

  const updateBankAccounts = useCallback((banks) => {
    if (banks.length && bankAccounts.length) {
      const updatedBankAccounts = bankAccounts.map(bankAccount => {
        const updatedBankAccount = { ...bankAccount };
        const accountBank = banks.filter(bank => bankAccount.bank === bank._id);
        if (accountBank.length) {
          updatedBankAccount.bank = accountBank[0].name;
          updatedBankAccount.ifsc = accountBank[0].ifsc;
        }
        return updatedBankAccount;
      });
      setBankAccountList(updatedBankAccounts);
    }
  }, [bankAccounts]);

  useEffect(() => {
    const controller = new AbortController();
    if (bankAccounts.length) {
      getBanks(controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            updateBankAccounts(response);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [bankAccounts, updateBankAccounts]);

  useEffect(() => {
    const controller = new AbortController();

    if (deleteBankAccountId) {
      setIsLoading(true);
      removeBankAccount(deleteBankAccountId, controller)
        .then(response => {
          setIsLoading(false);
          setDeleteBankAccountId('');
          const updatedbankAccountList = bankAccountList.filter(bankAccount => bankAccount._id !== response.id);
          setBankAccountList(updatedbankAccountList);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [deleteBankAccountId, bankAccountList]);

  const handleAddBankAccount = () => {
    navigate('/master/bankAccounts/addBankAccount');
  };

  const navigateToEdit = (id) => {
    if (checkAuth('master', 'bankAccounts', 'write')) {
      navigate('/master/bankAccounts/editBankAccount', { state: { bankAccountId: id } });
    } else {
      setIsUnauth(true);
    }
  };

  const deleteBankAccount = (id) => {
    if (checkAuth('master', 'bankAccounts', 'write')) {
      setSelectedId(id);
      setIsDialogOpen(true);
    } else {
      setIsUnauth(true);
    }
  };

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === 'true') {
      setDeleteBankAccountId(selectedId);
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

    {isDialogOpen && <Dialog isOpen={true} onClose={handleDialogClose} title='Are you sure?' content='Do you want to delete the bank account?' warning />}
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={isUnauth} autoHideDuration={6000} onClose={handleUnauthClose}>
      <Alert severity="warning">You are not authorized to perform the action</Alert>
    </Snackbar>

    <div className='page_head'>
      <h1 className='pageHead'>Bank account list</h1>
      <div className='page_actions'>
        <Button variant='contained' size='small' type='button' color='primary' className='ml6' onClick={handleAddBankAccount}>Add a bank account</Button>
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
        rows={bankAccountList}
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

export default BankAccountList;