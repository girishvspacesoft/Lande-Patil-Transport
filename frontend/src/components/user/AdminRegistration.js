import { useEffect, useState } from 'react';
import { TextField, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import { Alert, Stack } from '@mui/material';

import { registerUser } from '../../lib/api-user';
import LoadingSpinner from '../UI/LoadingSpinner';

const initialState = {
  type: 'Superadmin',
  username: '',
  password: '',
  confirmPassword: '',
  createdBy: 'self'
};

const initialErrorState = {
  username: {
    invalid: false,
    message: ''
  },
  password: {
    invalid: false,
    message: ''
  },
  confirmPassword: {
    invalid: false,
    message: ''
  }
};

const AdminRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userRegistration, setUserRegistration] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);


  useEffect(() => {
    const controller = new AbortController();
    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      registerUser(userRegistration)
        .then(responseData => {
          if (responseData.message) {
            setHttpError(responseData.message);
          } else {
            setHttpError('');
            setUserRegistration(initialState);
          }
          setIsLoading(false);
          setIsSubmitted(false);
        })
        .catch(error => {
          setHttpError('Something went wrong! Please try later or contact Administrator.');
          setIsSubmitted(false);
          setIsLoading(false);
        });
    };
    return () => {
      controller.abort();
    };
  }, [isSubmitted, hasErrors, userRegistration]);

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserRegistration(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.username.trim() === '') {
      errors.username = { invalid: true, message: 'Username is required' };
    }
    if (formData.password.trim() === '') {
      errors.password = { invalid: true, message: 'Password is required' };
    } else if (formData.password.trim().length < 5) {
      errors.password = { invalid: true, message: 'Password length should be 5 or more characters' };
    } else if (formData.password.trim() !== formData.confirmPassword.trim()) {
      errors.password = { invalid: true, message: 'Password and Confirm password does not match' };
    }
    if (formData.confirmPassword.trim() === '') {
      errors.confirmPassword = { invalid: true, message: 'Confirm password is required' };
    } else if (formData.password.trim().length < 5) {
      errors.confirmPassword = { invalid: true, message: 'Confirm password length should be 5 or more characters' };
    } else if (formData.password.trim() !== formData.confirmPassword.trim()) {
      errors.confirmPassword = { invalid: true, message: 'Password and Confirm password does not match' };
    };
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
    setFormErrors(currState => validateForm(userRegistration));
    setIsSubmitted(true);
  };

  const resetButtonHandler = () => {
    setIsSubmitted(false);
    setUserRegistration(initialState);
    setFormErrors(initialErrorState);
    setHttpError('');
  };

  return <>
    <>
      {isLoading && <LoadingSpinner />}

      <h1 className='pageHead'>Admin Registration</h1>

      {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
        <Alert severity='error'>{httpError}</Alert>
      </Stack>}
      <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
        <form action='' onSubmit={submitHandler}>
          <div className='grid grid-1-col'>
            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.username.invalid}>
                <TextField size='small' variant='outlined' label='Username' error={formErrors.username.invalid} value={userRegistration.username} onChange={inputChangeHandler} name='username' id='username' />
                {formErrors.username.invalid && <FormHelperText>{formErrors.username.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.password.invalid}>
                <TextField size='small' variant='outlined' label='Password' error={formErrors.password.invalid} type='password' value={userRegistration.password} onChange={inputChangeHandler} name='password' id='password' />
                {formErrors.password.invalid && <FormHelperText>{formErrors.password.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.confirmPassword.invalid}>
                <TextField size='small' variant='outlined' label='Confirm Password' error={formErrors.confirmPassword.invalid} type='password' value={userRegistration.confirmPassword} onChange={inputChangeHandler} name='confirmPassword' id='confirmPassword' />
                {formErrors.confirmPassword.invalid && <FormHelperText>{formErrors.confirmPassword.message}</FormHelperText>}
              </FormControl>
            </div>
          </div>
          <div className='right'>
            <Button variant='outlined' size='medium' onClick={resetButtonHandler}>Reset</Button>
            <Button variant='contained' size='medium' type='submit' color='primary' className='ml6'>Submit</Button>
          </div>
        </form>
      </Paper>
    </>

  </>
};
export default AdminRegistration;