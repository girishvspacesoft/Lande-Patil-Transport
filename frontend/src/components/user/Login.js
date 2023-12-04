import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import { Alert, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { update } from '../../redux/userSlice';

import { login } from '../../lib/api-user';
import LoadingSpinner from '../UI/LoadingSpinner';

const initialState = {
  username: '',
  password: ''
};

const initialErrorState = {
  username: {
    invalid: false,
    message: ''
  },
  password: {
    invalid: false,
    message: ''
  }
};

const Login = () => {
  const [loginData, setLoginData] = useState(initialState);
  const [userData, setUserData] = useState(null);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [employees, setEmployees] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // useEffect(() => {
  //   const controller = new AbortController();
  //   setIsLoading(true);
  //   getEmployees(controller)
  //     .then(response => {
  //       if (response.message) {
  //         setHttpError(response.message);
  //       } else {
  //         setHttpError('');
  //         setEmployees(response);
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch(error => {
  //       setIsLoading(false);
  //       setHttpError('Something went wrong! Please try later or contact Administrator.');
  //     });

  //   return () => {
  //     controller.abort();
  //   }
  // }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      login(loginData, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            localStorage.setItem('userData', JSON.stringify(response));
            dispatch(update({
              branch: response.branch,
              employee: response.employee,
              permissions: response.permissions,
              type: response.type,
              username: response.username
            }));
            setHttpError('');
            navigate('/');
            goToHome();
          }
          setIsLoading(false);
          setIsSubmitted(false);
        })
        .catch(error => {
          setHttpError('Something went wrong! Please try later or contact Administrator.');
          setIsLoading(false);
          setIsSubmitted(false);
        });
    };

    return () => {
      controller.abort();
    };
  }, [isSubmitted, hasErrors, loginData, goToHome, dispatch, navigate, employees]);


  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (!formData.username || formData.username.trim() === '') {
      errors.username = { invalid: true, message: 'Username is required' };
    }
    if (!formData.password || formData.password.trim() === '') {
      errors.password = { invalid: true, message: 'Password is required' };
    } else if (formData.password.trim().length < 5) {
      errors.password = { invalid: true, message: 'Password length should be 5 or more characters' };
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
    setFormErrors(currState => validateForm(loginData));
    setIsSubmitted(true);
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoginData(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  return <>
    {isLoading && <LoadingSpinner />}

    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <h2 className='pageHead'>Login</h2>
      {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
        <Alert severity='error'>{httpError}</Alert>
      </Stack>}

      <form onSubmit={submitHandler}>
        <div className='grid grid-1-col'>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.username.invalid}>
              <TextField variant='outlined' label='Username' error={formErrors.username.invalid} value={loginData.username} onChange={inputChangeHandler} name='username' id='username' />
              {formErrors.username.invalid && <FormHelperText>{formErrors.username.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.username.invalid}>
              <TextField variant='outlined' label='Password' type='password' error={formErrors.password.invalid} value={loginData.password} onChange={inputChangeHandler} name='password' id='password' />
              {formErrors.password.invalid && <FormHelperText>{formErrors.password.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grig-item right'>
            <Button variant='contained' size='medium' type='submit' color='primary' className='ml6'>Login</Button>
          </div>
        </div>
      </form>
    </Paper>
  </>;
};

export default Login;