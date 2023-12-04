import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Alert, Stack, InputLabel, MenuItem, FormControl, Button, Paper, FormHelperText, TextField } from '@mui/material';
import Select from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import LoadingSpinner from '../../UI/LoadingSpinner';
import { getBanks, getBranches } from '../../../lib/api-master';
import { getPettyTransactions, getPettyTransactionsByDate } from '../../../lib/api-transactions';
import { getFormattedDate, getFormattedTime, getFormattedTransactionNo, getFormattedLSNumber } from '../../../lib/helper';

const initialState = {
  startDate: null,
  endDate: null,
};

const initialErrorState = {
  startDate: {
    invalid: false,
    message: ''
  },
  endDate: {
    invalid: false,
    message: ''
  }
};

const PettyCashHistory = () => {
  const columns = [
    { field: '_id', headerName: 'Id' },
    {
      field: 'transactionNo', headerName: 'Transaction no.', flex: 1, renderCell: (params) => {
        return getFormattedTransactionNo(params.row.transactionNo);
      }
    },
    {
      field: 'date', headerName: 'Date & time', flex: 1, minWidth: 200, renderCell: (params) => {
        return `${getFormattedDate(new Date(params.row.date))} ${getFormattedTime(params.row.date)}`;
      }
    },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'credit', type: 'number', headerName: 'Credit', flex: 1, renderCell: (params) => {
        if (params.row.credit !== '-') {
          return `₹ ${params.row.credit.toFixed(2)}`;
        } else {
          return params.row.credit;
        }
      }
    },
    {
      field: 'debit', type: 'number', headerName: 'Debit', flex: 1, renderCell: (params) => {
        if (params.row.debit !== '-') {
          return `₹ ${params.row.debit.toFixed(2)}`;
        } else {
          return params.row.debit;
        }
      }
    },
    {
      field: 'bank', headerName: 'Bank & account no', flex: 1, minWidth: 300, renderCell: (params) => {
        const selectedBank = banks.filter(bank => bank._id === params.row.bank);
        return `${selectedBank.length ? selectedBank[0].name : params.row.bank} - ${params.row.bankAccountNumber}`;
      }
    },
    {
      field: 'lsNo', headerName: 'Challan no', flex: 1, renderCell: (params) => {
        return params.row.lsNo ? getFormattedLSNumber(params.row.lsNo) : '';
      }
    },
    {
      field: 'availableBal', type: 'number', headerName: 'Balance', flex: 1, renderCell: (params) => {
        return params.row.availableBal ? `₹ ${params.row.availableBal.toFixed(2)}` : `₹ 0.00`;
      }
    }
  ];

  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [banks, setBanks] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [pettyTransactions, setPettyTransactions] = useState([]);
  const [updatedPettyTransactions, setUpdatedPettyTransactions] = useState([]);
  const [httpError, setHttpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [search, setSearch] = useState(initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

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
    getBanks(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setBanks(response)
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
      getPettyTransactions(selectedBranch._id, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setPettyTransactions(response);
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
  }, [selectedBranch]);

  useEffect(() => {
    if (pettyTransactions.length) {
      const updatedTransactions = pettyTransactions.map(pt => {
        return {
          ...pt,
          credit: pt.type === 'credit' ? pt.amount : '-',
          debit: pt.type === 'debit' ? pt.amount : '-',
        }
      });
      setUpdatedPettyTransactions(updatedTransactions);
    } else {
      setUpdatedPettyTransactions([]);
    }
  }, [pettyTransactions]);


  const resetSearchForm = useCallback(() => {
    setHasErrors(false);
    setFormErrors(initialErrorState);
    setIsSubmitted(false);
    setSearch(initialState);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      getPettyTransactionsByDate(search, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setPettyTransactions(response);
            //resetSearchForm();
            setIsSubmitted(false);
            setFormErrors(initialErrorState);
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
  }, [isSubmitted, hasErrors, resetSearchForm, search]);

  const branchChangeHandler = (e) => {
    const filteredBranch = branches.filter(branch => branch._id === e.target.value);
    setSelectedBranch(filteredBranch[0]);
  };

  const handleAddPettyTransaction = () => {
    navigate('/transactions/pettyCashHistory/addPettyCashTransaction');
  };

  const inputChangeHandler = (name, date) => {
    setSearch(currState => {
      return {
        ...currState,
        [name]: new Date(date)
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(search));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (!formData.startDate) {
      errors.startDate = { invalid: true, message: 'Start date is required' };
    }
    if (!formData.endDate) {
      errors.endDate = { invalid: true, message: 'End date is required' };
    }

    let validationErrors = false;
    for (const key in errors) {
      if (errors[key].invalid === true) {
        validationErrors = true;
      }
    }
    if (validationErrors) {
      setHasErrors(true);
    } else {
      setHasErrors(false);
    }
    return errors;
  };

  return <>
    {isLoading && <LoadingSpinner />}

    <div className='page_head'>
      <h1 className='pageHead'>Petty cash transactions</h1>
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
        <Button variant='contained' size='small' type='button' color='primary' className='ml6' onClick={handleAddPettyTransaction}>Add a petty cash transaction</Button>
      </div>
    </div>

    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <h2 style={{ marginBottom: '10px' }}>Search</h2>
      <form action='' onSubmit={submitHandler}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.startDate.invalid}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Start date'
                  inputFormat='DD/MM/YYYY'
                  value={search.startDate}
                  disableFuture={true}
                  disableMaskedInput={true}
                  onChange={inputChangeHandler.bind(null, 'startDate')}
                  inputProps={{
                    readOnly: true
                  }}
                  renderInput={(params) => <TextField name='date' size='small' {...params} error={formErrors.startDate.invalid} />}
                />
              </LocalizationProvider>
              {formErrors.startDate.invalid && <FormHelperText>{formErrors.startDate.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.endDate.invalid}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='End date'
                  inputFormat='DD/MM/YYYY'
                  value={search.endDate}
                  disableMaskedInput={true}
                  onChange={inputChangeHandler.bind(null, 'endDate')}
                  inputProps={{
                    readOnly: true
                  }}
                  renderInput={(params) => <TextField name='date' size='small' {...params} error={formErrors.endDate.invalid} />}
                />
              </LocalizationProvider>
              {formErrors.endDate.invalid && <FormHelperText>{formErrors.endDate.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <IconButton size='small' variant='contained' color='primary' type='submit' style={{ backgroundColor: '#1e1e1e', marginLeft: '5px' }}>
              <SearchIcon style={{ color: '#ffffff', verticalAlign: 'middle' }} />
            </IconButton>
            <IconButton size='small' variant='contained' color='primary' type='button' onClick={resetSearchForm} style={{ backgroundColor: '#1e1e1e', marginLeft: '5px' }}>
              <RestartAltIcon style={{ color: '#ffffff', verticalAlign: 'middle' }} />
            </IconButton>
          </div>
        </div>
      </form>
    </Paper>

    {
      httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
        <Alert severity='error'>{httpError}</Alert>
      </Stack>
    }

    <DataGrid
      sx={{ backgroundColor: 'primary.contrastText' }}
      autoHeight
      density='compact'
      getRowId={(row) => row._id}
      rows={updatedPettyTransactions}
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

  </>;
};

export default PettyCashHistory;