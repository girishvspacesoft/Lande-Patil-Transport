import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import Select from '@mui/material/Select';
import { Alert, Stack } from '@mui/material';

import { getUser, updateUser } from '../../lib/api-user';
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

const UserEdit = () => {

  const location = useLocation();
  const { userId } = location.state ? location.state : { userId: '' };

  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState(false);
  const [fetchedUser, setFetchedUser] = useState({});
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

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

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (userId) {
      getUser(userId, controller)
        .then(response => {
          response.password = '';
          response.confirmPassword = '';
          setFetchedUser(response);
        })
        .catch(error => {
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [setFetchedUser, userId]);

  const goToUsersList = useCallback(() => {
    navigate('/user/usersList');
  }, [navigate]);

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFetchedUser(currState => {
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
    if (!formData.username || formData.username.trim() === '') {
      errors.username = { invalid: true, message: 'Username is required' };
    }
    if (!formData.password || formData.password.trim() === '') {
      errors.password = { invalid: true, message: 'Password is required' };
    } else if (formData.password.trim().length < 5) {
      errors.password = { invalid: true, message: 'Password length should be 5 or more characters' };
    } else if (formData.password.trim() !== formData.confirmPassword.trim()) {
      errors.password = { invalid: true, message: 'Password and Confirm password does not match' };
    }
    if (!formData.confirmPassword || formData.confirmPassword.trim() === '') {
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
    setFormErrors(currState => validateForm(fetchedUser));
    setIsSubmitted(true);
  };

  useEffect(() => {
    const controller = new AbortController();
    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      updateUser(fetchedUser, controller)
        .then(responseData => {
          if (responseData.message) {
            setHttpError(responseData.message);
          } else {
            setHttpError('');
            setFetchedUser(initialState);
            goToUsersList();
          }
          setIsSubmitted(false);
        })
        .catch(error => {
          setHttpError('Something went wrong! Please try later or contact Administrator.');
          setIsSubmitted(false);
        });
    };

    return () => {
      controller.abort();
    };
  }, [isSubmitted, hasErrors, fetchedUser, setFetchedUser, goToUsersList]);

  const cancelButtonHandler = () => {
    setIsSubmitted(false);
    setFetchedUser(initialState);
    setFormErrors(initialErrorState);
    setHttpError('');
    navigate('/users/usersList');
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}

      <h1 className='pageHead'>Update a user</h1>

      {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
        <Alert severity='error'>{httpError}</Alert>
      </Stack>}

      {fetchedUser && fetchedUser._id && <form action='' onSubmit={submitHandler}>
        <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
          <div className='grid grid-6-col'>
            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.branch.invalid} size='small'>
                <InputLabel id='branch'>Branch</InputLabel>
                <Select
                  labelId='branch'
                  name='branch'
                  value={fetchedUser.branch}
                  label='Branch'
                  onChange={inputChangeHandler}
                >
                  {branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
                </Select>
                {formErrors.branch.invalid && <FormHelperText>{formErrors.branch.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.type.invalid} size='small'>
                <InputLabel id='type'>User Type</InputLabel>
                <Select
                  labelId='type'
                  name='type'
                  value={fetchedUser.type}
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
              <FormControl fullWidth error={formErrors.employee.invalid} size='small'>
                <InputLabel id='employee'>Employee</InputLabel>
                <Select
                  labelId='employee'
                  name='employee'
                  value={fetchedUser.employee}
                  label='Employee'
                  onChange={inputChangeHandler}
                >
                  {employees.map(employee => <MenuItem key={employee._id} value={employee._id} className='menuItem'>{employee.name}</MenuItem>)}
                </Select>
                {formErrors.employee.invalid && <FormHelperText>{formErrors.employee.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.username.invalid}>
                <TextField variant='outlined' size='small' label='Username' error={formErrors.username.invalid} value={fetchedUser.username} onChange={inputChangeHandler} name='username' id='username' disabled={true} />
                {formErrors.username.invalid && <FormHelperText>{formErrors.username.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.password.invalid}>
                <TextField variant='outlined' size='small' label='Password' error={formErrors.password.invalid} type='password' value={fetchedUser.password} onChange={inputChangeHandler} name='password' id='password' />
                {formErrors.password.invalid && <FormHelperText>{formErrors.password.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.confirmPassword.invalid}>
                <TextField variant='outlined' size='small' label='Confirm Password' error={formErrors.confirmPassword.invalid} type='password' value={fetchedUser.confirmPassword} onChange={inputChangeHandler} name='confirmPassword' id='confirmPassword' />
                {formErrors.confirmPassword.invalid && <FormHelperText>{formErrors.confirmPassword.message}</FormHelperText>}
              </FormControl>
            </div>
          </div>
          <div className='right'>
            <Button variant='outlined' size='medium' onClick={cancelButtonHandler}>Cancel</Button>
            <Button variant='contained' size='medium' type='submit' color='primary' className='ml6'>Save</Button>
          </div>
        </Paper>
      </form>}
    </>
  );
};

export default UserEdit;