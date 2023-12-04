import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { TextField, FormControl, FormHelperText, Button, InputLabel, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const initialErrorState = {
  taxType: {
    invalid: false,
    message: ''
  },
  amount: {
    invalid: false,
    message: ''
  }
};

const initialState = {
  taxType: '',
  amount: '',
  startDate: null,
  endDate: null,
  description: ''
};


const TaxDetailForm = ({ onTaxDetailAdd, editTaxDetail }) => {
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [taxDetail, setTaxDetail] = useState(initialState);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    if (!hasErrors && isSubmitted) {
      onTaxDetailAdd(taxDetail);
      setIsSubmitted(false);
      setHasErrors(false);
      setFormErrors(initialErrorState);
      setTaxDetail(initialState);
    }
  }, [hasErrors, isSubmitted, taxDetail, onTaxDetailAdd]);

  useEffect(() => {
    if (editTaxDetail) {
      setTaxDetail(editTaxDetail);
    }
  }, [editTaxDetail]);


  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTaxDetail(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const dateInputChangeHandler = (name, date) => {
    setTaxDetail(currState => {
      return {
        ...currState,
        [name]: new Date(date)
      };
    });
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.taxType.trim() === '') {
      errors.type = { invalid: true, message: 'Tax type is required' };
    }
    if (formData.amount.trim() === '') {
      errors.amount = { invalid: true, message: 'Amount is required' };
    }
    if (isNaN(formData.amount) && isNaN(parseFloat(formData.amount))) {
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

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(taxDetail));
    setIsSubmitted(true);
  };

  return <form action='' id='taxDetailForm' onSubmit={submitHandler}>
    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant='h6' gutterBottom>
        Tax details
      </Typography>
      <div className='grid grid-3-col'>
        <div className='grid-item'>
          <FormControl fullWidth size='small' error={formErrors.taxType.invalid}>
            <InputLabel id='taxType'>Tax type</InputLabel>
            <Select
              labelId='taxType'
              name='taxType'
              value={taxDetail.taxType}
              label='Tax type'
              onChange={inputChangeHandler}
            >
              <MenuItem key='Insurance' value='Insurance' className='menuItem'>Insurance</MenuItem>
              <MenuItem key='Road tax' value='Road tax' className='menuItem'>Road tax</MenuItem>
              <MenuItem key='Fitness' value='Fitness' className='menuItem'>Fitness</MenuItem>
              <MenuItem key='PUC' value='PUC' className='menuItem'>PUC</MenuItem>
              <MenuItem key='RTO' value='RTO' className='menuItem'>RTO</MenuItem>
            </Select>
            {formErrors.taxType.invalid && <FormHelperText>{formErrors.taxType.message}</FormHelperText>}
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth error={formErrors.amount.invalid}>
            <TextField size='small' variant='outlined' label='Amount' value={taxDetail.amount} error={formErrors.amount.invalid} onChange={inputChangeHandler} name='amount' id='amount' />
            {formErrors.amount.invalid && <FormHelperText>{formErrors.amount.message}</FormHelperText>}
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth error>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Start date'
                inputFormat='DD/MM/YYYY'
                value={taxDetail.startDate}
                onChange={dateInputChangeHandler.bind(null, 'startDate')}
                inputProps={{
                  readOnly: true
                }}
                renderInput={(params) => <TextField name='startDate' size='small' {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth error>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='End date'
                inputFormat='DD/MM/YYYY'
                value={taxDetail.endDate}
                onChange={dateInputChangeHandler.bind(null, 'endDate')}
                inputProps={{
                  readOnly: true
                }}
                renderInput={(params) => <TextField name='endDate' size='small' {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth>
            <TextField size='small' variant='outlined' label='Description' value={taxDetail.description} onChange={inputChangeHandler} name='description' id='description' />
          </FormControl>
        </div>
      </div>
      <div className='right'>
        <Button variant='contained' size='medium' type='submit' color='primary' form='taxDetailForm'>{editTaxDetail ? 'Update' : 'Add'}</Button>
      </div>
    </Paper>
  </form>;
};

export default TaxDetailForm;