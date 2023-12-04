import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import Select from '@mui/material/Select';
import { Alert, Stack } from '@mui/material';

import { addEmployee } from '../../../lib/api-master';

import LoadingSpinner from '../../UI/LoadingSpinner';
import { emailRegEx, mobileNoRegEx } from '../../../lib/helper';

const initialEmployeeState = {
  name: '',
  correspondenceAddress: '',
  permanentAddress: '',
  dateOfBirth: null,
  mobile: '',
  email: '',
  joiningDate: null,
  qualification: '',
  bloodGroup: '',
  designation: ''
};

const initialErrorState = {
  name: {
    invalid: false,
    message: ''
  },
  mobile: {
    invalid: false,
    message: ''
  },
  email: {
    invalid: false,
    message: ''
  }
};

const EmployeeAdd = () => {
  const [employee, setEmployee] = useState(initialEmployeeState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const goToEmployeeList = useCallback(() => {
    navigate('/master/employees');
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();

    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      addEmployee(employee, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setEmployee(initialEmployeeState);
            goToEmployeeList();
          }
          setIsLoading(false);
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
  }, [isSubmitted, hasErrors, employee, goToEmployeeList]);

  const resetButtonHandler = () => {
    setEmployee(initialEmployeeState);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const cancelButtonHandler = () => {
    goToEmployeeList();
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setEmployee(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const dateInputChangeHandler = (name, date) => {
    setEmployee(currState => {
      return {
        ...currState,
        [name]: new Date(date)
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(employee));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.name.trim() === '') {
      errors.name = { invalid: true, message: 'Name is required' };
    }
    if (formData.mobile.trim() === '') {
      errors.mobile = { invalid: true, message: 'Mobile number is required' };
    }
    if (formData.mobile.trim() !== '' && !(mobileNoRegEx.test(formData.mobile))) {
      errors.mobile = { invalid: true, message: 'Mobile number is invalid' };
    }
    if (formData.email !== '' && !(emailRegEx.test(formData.email))) {
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
    {isLoading && <LoadingSpinner />}
    <h1 className='pageHead'>Add a employee</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}
    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <form action='' onSubmit={submitHandler}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.name.invalid}>
              <TextField size='small' variant='outlined' label='Name' error={formErrors.name.invalid} value={employee.name} onChange={inputChangeHandler} name='name' id='name' />
              {formErrors.name.invalid && <FormHelperText>{formErrors.name.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Correspondence address' value={employee.correspondenceAddress} onChange={inputChangeHandler} name='correspondenceAddress' id='correspondenceAddress' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Permenant address' value={employee.permanentAddress} onChange={inputChangeHandler} name='permanentAddress' id='permanentAddress' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Date of birth'
                  inputFormat='DD/MM/YYYY'
                  value={employee.dateOfBirth}
                  disableFuture={true}
                  onChange={dateInputChangeHandler.bind(null, 'dateOfBirth')}
                  inputProps={{
                    readOnly: true
                  }}
                  renderInput={(params) => <TextField name='dateOfBirth' size='small' disabled={true} {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.mobile.invalid}>
              <TextField variant='outlined' size='small' label='Mobile no.' error={formErrors.mobile.invalid} value={employee.mobile} onChange={inputChangeHandler} name='mobile' id='mobile' />
              {formErrors.mobile.invalid && <FormHelperText>{formErrors.mobile.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.email.invalid}>
              <TextField variant='outlined' size='small' label='Email' error={formErrors.email.invalid} value={employee.email} onChange={inputChangeHandler} name='email' id='email' />
              {formErrors.email.invalid && <FormHelperText>{formErrors.email.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Joining date'
                  inputFormat='DD/MM/YYYY'
                  value={employee.joiningDate}
                  onChange={dateInputChangeHandler.bind(null, 'joiningDate')}
                  inputProps={{
                    readOnly: true
                  }}
                  renderInput={(params) => <TextField name='joiningDate' size='small' {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField variant='outlined' size='small' label='Qualification' value={employee.qualification} onChange={inputChangeHandler} name='qualification' id='qualification' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth size='small'>
              <InputLabel id='bloodGroup'>Blood group</InputLabel>
              <Select
                labelId='bloodGroup'
                name='bloodGroup'
                value={employee.bloodGroup}
                label='bloodGroup'
                onChange={inputChangeHandler}
              >
                <MenuItem key='A-' value='A-' className='menuItem'>A-</MenuItem>
                <MenuItem key='B-' value='B-' className='menuItem'>B-</MenuItem>
                <MenuItem key='AB-' value='AB-' className='menuItem'>AB-</MenuItem>
                <MenuItem key='O-' value='O-' className='menuItem'>O-</MenuItem>
                <MenuItem key='A+' value='A+' className='menuItem'>A+</MenuItem>
                <MenuItem key='B+' value='B+' className='menuItem'>B+</MenuItem>
                <MenuItem key='AB+' value='AB+' className='menuItem'>AB+</MenuItem>
                <MenuItem key='O+' value='O+' className='menuItem'>O+</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField variant='outlined' size='small' label='Designation' value={employee.designation} onChange={inputChangeHandler} name='designation' id='designation' />
            </FormControl>
          </div>
        </div>
        <div className='right'>
          <Button variant='outlined' size='medium' onClick={cancelButtonHandler}>Cancel</Button>
          <Button variant='outlined' size='medium' onClick={resetButtonHandler} className='ml6'>Reset</Button>
          <Button variant='contained' size='medium' type='submit' color='primary' className='ml6'>Save</Button>
        </div>
      </form>
    </Paper>
  </>;
};

export default EmployeeAdd;