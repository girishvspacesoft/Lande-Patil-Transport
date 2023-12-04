import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import Select from '@mui/material/Select';
import { Alert, Stack } from '@mui/material';

import { registerUser } from '../../lib/api-user';
import { getBranches, getEmployees } from '../../lib/api-master';
import LoadingSpinner from '../UI/LoadingSpinner';

const initialState = {
  branch: '',
  type: '',
  employee: '',
  username: '',
  password: '',
  confirmPassword: ''
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
  employee: {
    invalid: false,
    message: ''
  },
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

const UserRegistration = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [userRegistration, setUserRegistration] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);

  const navigate = useNavigate();
  const goToUsersList = useCallback(() => {
    navigate('/users/usersList');
  }, [navigate]);


  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    getBranches(controller)
      .then(response => {
        if (response.messgage) {
          setHttpError(response.message);
        } else {
          setBranches(response);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setHttpError(error.message);
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    if (branches.length) {
      setIsLoading(true);
      getEmployees(controller)
        .then(response => {
          if (response.messgage) {
            setHttpError(response.message);
          } else {
            setEmployees(response);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setHttpError(error.message);
          setIsLoading(false);
        });
    };

    return () => {
      controller.abort();
    };
  }, [branches]);

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
            goToUsersList();
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
  }, [isSubmitted, hasErrors, userRegistration, goToUsersList]);

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
    if (formData.branch.trim() === '') {
      errors.branch = { invalid: true, message: 'Branch is required' };
    }
    if (formData.type.trim() === '') {
      errors.type = { invalid: true, message: 'User type is required' };
    }
    if (formData.employee.trim() === '') {
      errors.employee = { invalid: true, message: 'Employee is required' };
    }
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

  const cancelButtonHandler = () => {
    goToUsersList();
  }


  return (
    <>
      {isLoading && <LoadingSpinner />}

      <h1 className='pageHead'>User Registration</h1>

      {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
        <Alert severity='error'>{httpError}</Alert>
      </Stack>}
      <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
        <form action='' onSubmit={submitHandler}>
          <div className='grid grid-6-col'>
            <div className='grid-item'>
              <FormControl fullWidth size='small' error={formErrors.branch.invalid}>
                <InputLabel id='branch'>Branch</InputLabel>
                <Select
                  labelId='branch'
                  name='branch'
                  value={userRegistration.branch}
                  label='Branch'
                  onChange={inputChangeHandler}
                >
                  {branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
                </Select>
                {formErrors.branch.invalid && <FormHelperText>{formErrors.branch.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth size='small' error={formErrors.type.invalid}>
                <InputLabel id='type'>User Type</InputLabel>
                <Select
                  labelId='type'
                  name='type'
                  value={userRegistration.type}
                  label='User Type'
                  onChange={inputChangeHandler}
                >
                  <MenuItem value={'Admin'} className='menuItem'>Admin</MenuItem>
                  <MenuItem value={'User'} className='menuItem'>User</MenuItem>
                </Select>
                {formErrors.type.invalid && <FormHelperText>{formErrors.type.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth size='small' error={formErrors.employee.invalid}>
                <InputLabel id='employee'>Employee</InputLabel>
                <Select
                  labelId='employee'
                  name='employee'
                  value={userRegistration.employee}
                  label='Employee'
                  onChange={inputChangeHandler}
                >
                  {employees.length > 0 && employees.map(employee => <MenuItem key={employee._id} value={employee._id} className='menuItem'>{employee.name}</MenuItem>)}
                </Select>
                {formErrors.employee.invalid && <FormHelperText>{formErrors.employee.message}</FormHelperText>}
              </FormControl>
            </div>
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
            <Button variant='outlined' size='medium' onClick={cancelButtonHandler} className='ml6'>Cancel</Button>
            <Button variant='contained' size='medium' type='submit' color='primary' className='ml6'>Save</Button>
          </div>
        </form>
      </Paper>
    </>
  );
};

export default UserRegistration;