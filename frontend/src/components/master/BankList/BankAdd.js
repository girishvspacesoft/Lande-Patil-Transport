import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import { Alert, Stack } from '@mui/material';

import { addBank } from '../../../lib/api-master';
import { mobileNoRegEx, emailRegEx } from '../../../lib/helper';

const initialState = {
  name: '',
  branchName: '',
  branchCode: '',
  ifsc: '',
  micr: '',
  phone: '',
  email: '',
  address: ''
};

const initialErrorState = {
  name: {
    invalid: false,
    message: ''
  },
  ifsc: {
    invalid: false,
    message: ''
  },
  phone: {
    invalid: false,
    message: ''
  },
  email: {
    invalid: false,
    message: ''
  }
};

const BankAdd = () => {
  const [bank, setBank] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);

  const navigate = useNavigate();

  const goToBankList = useCallback(() => {
    navigate('/master/banks');
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();

    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      addBank(bank, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setBank(initialState);
            goToBankList();
          }
          setIsSubmitted(false);
        })
        .catch(error => {
          setHttpError(error.message);
        });
    }

    return () => {
      controller.abort();
    };
  }, [isSubmitted, hasErrors, bank, goToBankList]);

  const resetButtonHandler = () => {
    setBank(initialState);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const backButtonHandler = () => {
    goToBankList();
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBank(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(bank));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.name.trim() === '') {
      errors.name = { invalid: true, message: 'Bank name is required' };
    }
    if (formData.ifsc.trim() === '') {
      errors.ifsc = { invalid: true, message: 'IFSC code is required' };
    }
    if (formData.mobile && formData.mobile.trim() !== '' && !(mobileNoRegEx.test(formData.mobile))) {
      errors.mobile = { invalid: true, message: 'Phon should be 10 digits number' };
    }
    if (formData.email && formData.email.trim() !== '' && !(emailRegEx.test(formData.email))) {
      errors.email = { invalid: true, message: 'Email is invalid' };
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
    <h1 className='pageHead'>Add a bank</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}
    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <form action='' onSubmit={submitHandler}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.name.invalid}>
              <TextField size='small' variant='outlined' label='Bank name' value={bank.name} error={formErrors.name.invalid} onChange={inputChangeHandler} name='name' id='name' />
              {formErrors.name.invalid && <FormHelperText>{formErrors.name.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Branch name' value={bank.branchName} onChange={inputChangeHandler} name='branchName' id='branchName' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Branch code' value={bank.branchCode} onChange={inputChangeHandler} name='branchCode' id='branchCode' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.ifsc.invalid}>
              <TextField size='small' variant='outlined' label='IFSC code' value={bank.ifsc} error={formErrors.ifsc.invalid} onChange={inputChangeHandler} name='ifsc' id='ifsc' />
              {formErrors.ifsc.invalid && <FormHelperText>{formErrors.ifsc.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='MICR code' value={bank.micr} onChange={inputChangeHandler} name='micr' id='micr' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Phone' value={bank.phone} onChange={inputChangeHandler} name='phone' id='phone' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Email' value={bank.email} onChange={inputChangeHandler} name='email' id='email' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Address' value={bank.address} onChange={inputChangeHandler} name='address' id='address' />
            </FormControl>
          </div>
        </div>
        <div className='right'>
          <Button variant='outlined' size='medium' onClick={backButtonHandler}>Back</Button>
          <Button variant='outlined' size='medium' onClick={resetButtonHandler} className='ml6'>Reset</Button>
          <Button variant='contained' size='medium' type='submit' color='primary' className='ml6'>Save</Button>
        </div>
      </form>
    </Paper>
  </>;
};

export default BankAdd;