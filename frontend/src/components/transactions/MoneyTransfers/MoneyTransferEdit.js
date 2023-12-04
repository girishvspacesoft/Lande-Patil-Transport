import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import Select from '@mui/material/Select';
import { Alert, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import LoadingSpinner from '../../UI/LoadingSpinner';
import { getBranches } from '../../../lib/api-master';
import { updateMoneyTransfer, getMoneyTransfer } from '../../../lib/api-transactions';

const initialState = {
  branch: '',
  transferToBranch: '',
  date: null,
  amount: '',
  remark: ''
};

const initialErrorState = {
  branch: {
    invalid: false,
    message: ''
  },
  transferToBranch: {
    invalid: false,
    message: ''
  },
  date: {
    invalid: false,
    message: ''
  },
  amount: {
    invalid: false,
    message: ''
  },
  remark: {
    invalid: false,
    message: ''
  }
};

const MoneyTransferEdit = () => {
  const [branches, setBranches] = useState([]);
  const [moneyTransfer, setMoneyTransfer] = useState(initialState);
  const [fetchedMoneyTransfer, setFetchedMoneyTransfer] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { mtId } = location.state;

  const goToMoneyTransfers = useCallback(() => {
    navigate('/transactions/moneyTransfers');
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    getBranches(controller)
      .then(response => {
        if (response.message) {
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        } else {
          setBranches(response);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setHttpError('Something went wrong! Please try later or contact Administrator.')
      });
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (mtId) {
      setIsLoading(true);
      getMoneyTransfer(mtId, controller)
        .then(response => {
          if (response.message) {
            setIsLoading(false);
            setHttpError(response.message);
          } else {
            setMoneyTransfer(response);
            setFetchedMoneyTransfer(response);
            setFormErrors(initialErrorState);
            setIsLoading(false);
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
  }, [mtId]);

  useEffect(() => {
    const controller = new AbortController();
    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      updateMoneyTransfer(moneyTransfer, controller)
        .then(response => {
          if (response.message) {
            setIsLoading(false);
            setHttpError(response.message);
          } else {
            setHttpError('');
            setFormErrors(initialErrorState);
            setMoneyTransfer(initialState);
            setIsLoading(false);
            goToMoneyTransfers();
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
  }, [isSubmitted, hasErrors, moneyTransfer, goToMoneyTransfers]);


  const resetButtonHandler = () => {
    setMoneyTransfer(fetchedMoneyTransfer);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const backButtonHandler = () => {
    goToMoneyTransfers();
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setMoneyTransfer(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const dateInputChangeHandler = (name, date) => {
    setMoneyTransfer(currState => {
      return {
        ...currState,
        [name]: new Date(date)
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(moneyTransfer));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.branch.trim() === '') {
      errors.branch = { invalid: true, message: 'Branch is required' };
    }
    if (!formData.date) {
      errors.date = { invalid: true, message: 'Date is required' };
    }
    if (isNaN(formData.amount) && (formData.amount.trim() === '' || formData.amount.trim() === '0')) {
      errors.amount = { invalid: true, message: 'Amount is required and should be greater than 0' };
    }
    if (formData.amount && isNaN(formData.amount)) {
      errors.amount = { invalid: true, message: 'Amount should be a number' };
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
                value={moneyTransfer.branch}
                onChange={inputChangeHandler}
              >
                {branches.length > 0 && branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
              </Select>
              {formErrors.branch.invalid && <FormHelperText>{formErrors.branch.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.transferToBranch.invalid}>
              <InputLabel id='transferToBranch'>Transfer to branch</InputLabel>
              <Select
                labelId='transferToBranch'
                name='transferToBranch'
                label='Transfer to branch'
                value={moneyTransfer.transferToBranch}
                onChange={inputChangeHandler}
              >
                {branches.length > 0 && branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
              </Select>
              {formErrors.transferToBranch.invalid && <FormHelperText>{formErrors.transferToBranch.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.date.invalid}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Date'
                  inputFormat='DD/MM/YYYY'
                  value={moneyTransfer.date}
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
            <FormControl fullWidth error={formErrors.amount.invalid}>
              <TextField size='small' variant='outlined' label='Amount' value={moneyTransfer.amount} error={formErrors.amount.invalid} onChange={inputChangeHandler} name='amount' id='amount' />
              {formErrors.amount.invalid && <FormHelperText>{formErrors.amount.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Remark' value={moneyTransfer.remark} onChange={inputChangeHandler} name='remark' id='remark' />
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

export default MoneyTransferEdit;