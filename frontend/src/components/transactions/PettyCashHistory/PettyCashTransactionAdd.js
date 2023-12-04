import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper, FormControlLabel, InputAdornment } from '@mui/material';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Alert, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import LoadingSpinner from '../../UI/LoadingSpinner';


import { getBranches, getDataForPettyTransaction } from '../../../lib/api-master';
import { addPettyTransaction, getLoadingSlips, getPettyCashBalance } from '../../../lib/api-transactions';
import { getFormattedLSNumber } from '../../../lib/helper';

const MoneyTransferAdd = () => {

  const initialState = {
    branch: '',
    transactionType: '',
    transactionName: '',
    type: '',
    lsNo: '',
    amount: 0,
    availableBal: 0,
    date: new Date(),
    bank: '',
    bankAccountNumber: '',
    description: '',
  };

  const initialErrorState = {
    branch: {
      invalid: false,
      message: ''
    },
    type: {
      invalid: false,
      message: ''
    },
    amount: {
      invalid: false,
      message: ''
    },
    date: {
      invalid: false,
      message: ''
    },
    transactionType: {
      invalid: false,
      message: ''
    },
    transactionName: {
      invalid: false,
      message: ''
    },
    bank: {
      invalid: false,
      message: ''
    },
    bankAccountNumber: {
      invalid: false,
      message: ''
    },
    description: {
      invalid: false,
      message: ''
    }
  };

  const [branches, setBranches] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [banks, setBanks] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [filteredBankAccounts, setFilteredBankAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [transaction, setTransaction] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [loadingSlips, setLoadingSlips] = useState([]);
  const [selectedTab, setSelectedTab] = useState('transaction');
  const navigate = useNavigate();

  const goToPettyCashHistory = useCallback(() => {
    navigate('/transactions/pettyCashHistory');
  }, [navigate]);

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
              setTransaction(currState => {
                return {
                  ...currState,
                  branch: filteredBranch[0]._id
                }
              });
            }
          }
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setHttpError('Something went wrong! Please try later or contact Administrator.');
      });

    getDataForPettyTransaction(controller)
      .then(response => {
        if (response.message) {
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        } else {
          setHttpError('');
          if (response.length === 6) {
            setSuppliers(response[0]);
            setDrivers(response[1]);
            setCustomers(response[2]);
            setEmployees(response[3]);
            setBanks(response[4]);
            setBankAccounts(response[5]);
          }
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setHttpError('Something went wrong! Please try later or contact Administrator.');
      });

    getPettyCashBalance(controller)
      .then(response => {
        if (response.message) {
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        } else {
          setHttpError('');
          setTransaction(currState => {
            return {
              ...currState,
              availableBal: response.balance
            };
          });
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

    if (transaction.branch) {
      getLoadingSlips(transaction.branch)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setLoadingSlips(response);
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
  }, [transaction.branch]);

  useEffect(() => {
    const controller = new AbortController();
    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);

      addPettyTransaction(transaction, controller)
        .then(response => {
          if (response.message) {
            setIsLoading(false);
            setHttpError(response.message);
          } else {
            setHttpError('');
            setIsLoading(false);
            goToPettyCashHistory();
          }
          setIsSubmitted(false);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError(error.message);
        });
    };

    return () => {
      controller.abort();
    };
  }, [isSubmitted, hasErrors, transaction, goToPettyCashHistory]);

  const resetButtonHandler = () => {
    let branch;
    const filteredBranch = branches.filter(branch => {
      return branch.name.toLowerCase() === 'camp'
    });
    if (filteredBranch.length) {
      branch = filteredBranch[0]._id;
    }
    setTransaction(() => {
      return {
        ...initialState,
        branch: branch
      };
    });
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const backButtonHandler = () => {
    goToPettyCashHistory();
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTransaction(currState => {
      return {
        ...currState,
        [name]: value
      };
    });

    if (name === 'transactionType') {
      setTransaction(currState => {
        return {
          ...currState,
          transactionName: ''
        };
      });
    }
    if (name === 'bank') {
      setFilteredBankAccounts(bankAccounts.filter(bankAccount => {
        return bankAccount.bank === value;
      }));
    }
    if (name === 'lsNo') {
      const selectedLs = loadingSlips.filter(ls => ls.lsNo === value)[0];
      setTransaction(currState => {
        return {
          ...currState,
          amount: selectedLs.advance
        };
      });
    }
  };

  const dateInputChangeHandler = (name, date) => {
    setTransaction(currState => {
      return {
        ...currState,
        [name]: new Date(date)
      };
    });
  };

  const handleTabChange = (e, value) => {
    setSelectedTab(value);
    setTransaction(currState => {
      return {
        ...currState,
        bank: '',
        bankAccountNumber: '',
        transactionType: '',
        transactionName: '',
        lsNo: '',
        amount: 0
      }
    })
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(transaction));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.branch.trim() === '') {
      errors.branch = { invalid: true, message: 'Branch is required' };
    }
    if (isNaN(formData.amount) || formData.amount <= 0) {
      errors.amount = { invalid: true, message: 'Amount should be a number and greater than 0' };
    }
    if (!formData.date) {
      errors.date = { invalid: true, message: 'Date is required' };
    }
    if (formData.description.trim() === '') {
      errors.description = { invalid: true, message: 'Description is required' };
    }
    if (formData.type.trim() === '') {
      errors.type = { invalid: true, message: 'Debit / Credit is required' };
    }
    if (selectedTab === 'transaction' && formData.transactionType.trim() === '') {
      errors.transactionType = { invalid: true, message: 'Transaction type is required' };
    }
    if (selectedTab === 'transaction' && formData.transactionName.trim() === '') {
      errors.transactionName = { invalid: true, message: 'Transaction name is required' };
    }
    if (selectedTab === 'transfer' && formData.bank.trim() === '') {
      errors.bank = { invalid: true, message: 'Bank is required' };
    }
    if (selectedTab === 'transfer' && formData.bankAccountNumber.trim() === '') {
      errors.bankAccountNumber = { invalid: true, message: 'Bank account number is required' };
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

    <h1 className='pageHead'>Add a money transfer</h1>

    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}

    <Tabs value={selectedTab} onChange={handleTabChange}>
      <Tab value='transaction' label='New transaction' wrapped />
      <Tab value="transfer" label="Transfer in petty cash" wrapped />
    </Tabs>
    <form action='' onSubmit={submitHandler}>
      <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.branch.invalid}>
              <InputLabel id='branch'>Branch</InputLabel>
              <Select
                labelId='branch'
                name='branch'
                label='Branch'
                value={transaction.branch}
                onChange={inputChangeHandler}
              >
                {branches.length > 0 && branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
              </Select>
              {formErrors.branch.invalid && <FormHelperText>{formErrors.branch.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Available balance' value={transaction.availableBal} onChange={inputChangeHandler} name='availableBal' id='availableBal' InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start">&#8377;</InputAdornment> }} />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.date.invalid}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Date'
                  inputFormat='DD/MM/YYYY'
                  value={transaction.date}
                  disableFuture={true}
                  disableMaskedInput={true}
                  onChange={dateInputChangeHandler.bind(null, 'date')}
                  inputProps={{
                    readOnly: true
                  }}
                  renderInput={(params) => <TextField name='date' size='small' {...params} error={formErrors.date.invalid} />}
                />
              </LocalizationProvider>
              {formErrors.date.invalid && <FormHelperText>{formErrors.date.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth sx={{ alignItems: 'center' }} error={formErrors.type.invalid}>
              <RadioGroup row name='type'>
                <FormControlLabel value="debit" control={<Radio size="small" />} label="Debit" onChange={inputChangeHandler} />
                <FormControlLabel value="credit" control={<Radio size="small" />} label="Credit" onChange={inputChangeHandler} />
              </RadioGroup>
              {formErrors.type.invalid && <FormHelperText>{formErrors.type.message}</FormHelperText>}
            </FormControl>
          </div>
          {selectedTab === 'transaction' && <div className='grid-item'>
            <FormControl fullWidth size='small'>
              <InputLabel id='challanAdance'>Challan advance</InputLabel>
              <Select
                labelId='challanAdance'
                name='lsNo'
                label='Challan advance'
                value={transaction.lsNo}
                onChange={inputChangeHandler}
              >
                {loadingSlips.length > 0 && loadingSlips.map(ls => <MenuItem key={ls._id} value={ls.lsNo} className='menuItem'>{getFormattedLSNumber(ls.lsNo)}</MenuItem>)}
              </Select>
            </FormControl>
          </div>}
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.amount.invalid}>
              <TextField size='small' variant='outlined' label='Amount' value={transaction.amount} error={formErrors.amount.invalid} onChange={inputChangeHandler} name='amount' id='amount' InputProps={{ startAdornment: <InputAdornment position="start">&#8377;</InputAdornment> }} />
              {formErrors.amount.invalid && <FormHelperText>{formErrors.amount.message}</FormHelperText>}
            </FormControl>
          </div>
          {selectedTab === 'transaction' && <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.transactionType.invalid}>
              <InputLabel id='transactionType'>Type</InputLabel>
              <Select
                labelId='transactionType'
                name='transactionType'
                label='Type'
                value={transaction.transactionType}
                onChange={inputChangeHandler}
              >
                <MenuItem key='Customer' value='customer' className='menuItem'>Customer</MenuItem>
                <MenuItem key='Driver' value='driver' className='menuItem'>Driver</MenuItem>
                <MenuItem key='Employee' value='employee' className='menuItem'>Employee</MenuItem>
                <MenuItem key='Supplier' value='supplier' className='menuItem'>Supplier</MenuItem>
              </Select>
              {formErrors.transactionType.invalid && <FormHelperText>{formErrors.transactionType.message}</FormHelperText>}
            </FormControl>
          </div>}

          {selectedTab === 'transaction' && customers.length > 0 && drivers.length > 0 && employees.length > 0 && suppliers.length > 0 && <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.transactionName.invalid}>
              <InputLabel id='typeName'>Type name</InputLabel>
              <Select
                labelId='typeName'
                name='transactionName'
                label='Type name'
                value={transaction.transactionName}
                onChange={inputChangeHandler}
              >
                {transaction.transactionType === 'customer' && customers.map(customer => <MenuItem key={customer._id} value={customer.name} className='menuItem'>{customer.name}</MenuItem>)}
                {transaction.transactionType === 'driver' && drivers.map(driver => <MenuItem key={driver._id} value={driver.name} className='menuItem'>{driver.name}</MenuItem>)}
                {transaction.transactionType === 'employee' && employees.map(employee => <MenuItem key={employee._id} value={employee.name} className='menuItem'>{employee.name}</MenuItem>)}
                {transaction.transactionType === 'supplier' && suppliers.map(supplier => <MenuItem key={supplier._id} value={supplier.name} className='menuItem'>{supplier.name}</MenuItem>)}
              </Select>
              {formErrors.transactionName.invalid && <FormHelperText>{formErrors.transactionName.message}</FormHelperText>}
            </FormControl>
          </div>}

          {selectedTab === 'transfer' &&
            <>
              <div className='grid-item'></div>
              <div className='grid-item'>
                <FormControl fullWidth size='small' error={formErrors.bank.invalid}>
                  <InputLabel id='typeName'>Bank</InputLabel>
                  <Select
                    labelId='typeName'
                    name='bank'
                    label='Bank'
                    value={transaction.bank}
                    onChange={inputChangeHandler}
                  >
                    {banks.map(bank => <MenuItem key={bank._id} value={bank._id} className='menuItem'>{bank.name}</MenuItem>)}
                  </Select>
                  {formErrors.bank.invalid && <FormHelperText>{formErrors.bank.message}</FormHelperText>}
                </FormControl>
              </div>
              <div className='grid-item'>
                <FormControl fullWidth size='small' error={formErrors.bankAccountNumber.invalid}>
                  <InputLabel id='typeName'>Bank account number</InputLabel>
                  <Select
                    labelId='typeName'
                    name='bankAccountNumber'
                    label='Bank account number'
                    value={transaction.bankAccountNumber}
                    onChange={inputChangeHandler}
                  >
                    {filteredBankAccounts.map(bankAccount => <MenuItem key={bankAccount._id} value={bankAccount.accountNo} className='menuItem'>{bankAccount.accountNo}</MenuItem>)}
                  </Select>
                  {formErrors.bankAccountNumber.invalid && <FormHelperText>{formErrors.bankAccountNumber.message}</FormHelperText>}
                </FormControl>
              </div>
            </>
          }

          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.description.invalid}>
              <TextField size='small' variant='outlined' label='Description' value={transaction.description} error={formErrors.description.invalid} onChange={inputChangeHandler} name='description' id='description' />
              {formErrors.description.invalid && <FormHelperText>{formErrors.description.message}</FormHelperText>}
            </FormControl>
          </div>
        </div>
        <div className='right'>
          <Button variant='outlined' size='medium' onClick={backButtonHandler}>Back</Button>
          <Button variant='outlined' size='medium' onClick={resetButtonHandler} className='ml6'>Reset</Button>
          <Button variant='contained' size='medium' type='submit' color='primary' className='ml6'>Save</Button>
        </div>
      </Paper>
    </form>
  </>;
};

export default MoneyTransferAdd;