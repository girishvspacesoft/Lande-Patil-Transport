import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Stack, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper, Divider, TextField, InputAdornment } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from '@mui/material/Select';

import { getBranches } from '../../../lib/api-master';
import { saveSupplierBill } from '../../../lib/api-transactions';
import LoadingSpinner from '../../UI/LoadingSpinner';

const AddSupplierBill = ({ selectedSupplier, setTriggerFetch }) => {

  const initialState = useMemo(() => ({
    branch: '',
    supplier: selectedSupplier || '',
    date: new Date(),
    invoiceNo: '',
    invoiceDate: null,
    supplyName: '',
    quantity: '',
    amount: 0
  }), [selectedSupplier]);

  const initialErrorState = {
    branch: {
      invalid: false,
      message: ''
    },
    date: {
      invalid: false,
      message: ''
    },
    invoiceNo: {
      invalid: false,
      message: ''
    },
    invoiceDate: {
      invalid: false,
      message: ''
    },
    supplyName: {
      invalid: false,
      message: ''
    },
    quantity: {
      invalid: false,
      message: ''
    },
    amount: {
      invalid: false,
      message: ''
    }
  };

  const user = useSelector(state => state.user);
  const [branches, setBranches] = useState([]);
  const [bill, setBill] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cancelButtonHandler = useCallback(() => {
    const branch = user.branch;
    setBill(() => {
      return {
        ...initialState,
        branch: branch
      }
    });
  }, [initialState, user.branch]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    getBranches(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          //setSelectedBranch(user.branch);
          setBranches(response);
          setBill(currState => {
            return {
              ...currState,
              branch: user.branch
            }
          })
        }
        setIsLoading(false);
      })
      .catch(e => {
        setHttpError('Something went wrong! Please try later or contact Administrator.');
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [user]);

  useEffect(() => {
    const controller = new AbortController();
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      saveSupplierBill(bill, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            cancelButtonHandler();
          }
          setIsSubmitted(false);
          setIsLoading(false);
          setTriggerFetch(true);
        })
        .catch(e => {
          setIsLoading(false);
          setHttpError(e.message);
        });
    }

    return () => {
      controller.abort();
    };
  }, [isSubmitted, hasErrors, bill, cancelButtonHandler]);

  const inputChangeHandler = (e) => {
    if (e.target.name === 'amount') {
      e.target.value = e.target.value.replace(/[^0-9.-]/g, '');
    }
    const name = e.target.name;
    const value = e.target.value;
    setBill(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const dateInputChangeHandler = (name, date) => {
    setBill(currState => {
      return {
        ...currState,
        [name]: new Date(date)
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(bill));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };

    if (formData.branch.trim() === '') {
      errors.branch = { invalid: true, message: 'Branch is required' };
    }
    if (!formData.invoiceNo.trim()) {
      errors.invoiceNo = { invalid: true, message: 'Invoice no is required' };
    }
    if (!formData.invoiceDate) {
      errors.invoiceDate = { invalid: true, message: 'Invoice date is required' };
    }
    if (formData.supplyName.trim() === '') {
      errors.supplyName = { invalid: true, message: 'Supply name is required' };
    }
    if (formData.quantity.trim() === '') {
      errors.quantity = { invalid: true, message: 'Quantity is required' };
    }
    if (formData.amount <= 0) {
      errors.amount = { invalid: true, message: 'Amount is required' };
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

    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}

    <h2 className='mb20'>Add a new bill</h2>
    <form action='' onSubmit={submitHandler}>
      <div className='grid grid-6-col'>
        <div className='grid-item'>
          <FormControl fullWidth size='small' error={formErrors.branch.invalid}>
            <InputLabel id='branch'>Branch</InputLabel>
            <Select
              labelId='branch'
              name='branch'
              label='Branch'
              value={bill.branch}
              onChange={inputChangeHandler}
            >
              {branches.length > 0 && branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
            </Select>
            {formErrors.branch.invalid && <FormHelperText>{formErrors.branch.message}</FormHelperText>}
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Date'
                inputFormat='DD/MM/YYYY'
                value={bill.date}
                disableFuture={true}
                onChange={dateInputChangeHandler.bind(null, 'date')}
                inputProps={{
                  readOnly: true
                }}
                renderInput={(params) => <TextField name='date' size='small' {...params} />}
              />
            </LocalizationProvider>
            {formErrors.date.invalid && <FormHelperText>{formErrors.date.message}</FormHelperText>}
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth error={formErrors.invoiceNo.invalid}>
            <TextField size='small' variant='outlined' label='Invoice no' value={bill.invoiceNo} onChange={inputChangeHandler} name='invoiceNo' id='invoiceNo' error={formErrors.invoiceNo.invalid} />
            {formErrors.invoiceNo.invalid && <FormHelperText>{formErrors.invoiceNo.message}</FormHelperText>}
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth error={formErrors.invoiceDate.invalid}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Invoice date'
                inputFormat='DD/MM/YYYY'
                value={bill.invoiceDate}
                disableFuture={true}
                onChange={dateInputChangeHandler.bind(null, 'invoiceDate')}
                inputProps={{
                  readOnly: true
                }}
                renderInput={(params) => <TextField name='invoiceDate' size='small' {...params} error={formErrors.invoiceDate.invalid} />}
              />
            </LocalizationProvider>
            {formErrors.invoiceDate.invalid && <FormHelperText>{formErrors.invoiceDate.message}</FormHelperText>}
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth error={formErrors.supplyName.invalid}>
            <TextField size='small' variant='outlined' label='Supply name' value={bill.supplyName} onChange={inputChangeHandler} name='supplyName' id='supplyName' error={formErrors.supplyName.invalid} />
            {formErrors.supplyName.invalid && <FormHelperText>{formErrors.supplyName.message}</FormHelperText>}
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth error={formErrors.quantity.invalid}>
            <TextField size='small' variant='outlined' label='Quantity' value={bill.quantity} onChange={inputChangeHandler} name='quantity' id='quantity' error={formErrors.quantity.invalid} />
            {formErrors.quantity.invalid && <FormHelperText>{formErrors.quantity.message}</FormHelperText>}
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth error={formErrors.amount.invalid}>
            <TextField size='small' variant='outlined' label='Amount' value={bill.amount} error={formErrors.amount.invalid} name='amount' id='amount' onChange={inputChangeHandler} InputProps={{
              startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>
            }} />
            {formErrors.amount.invalid && <FormHelperText>{formErrors.amount.message}</FormHelperText>}
          </FormControl>
        </div>
      </div>
      <div className='right'>
        <Button variant='outlined' size='medium' onClick={cancelButtonHandler} className='ml6'>Cancel</Button>
        <Button variant='contained' size='medium' type='submit' color='primary' className='ml6'>Save</Button>
      </div>
    </form>
  </>;
};
export default AddSupplierBill;