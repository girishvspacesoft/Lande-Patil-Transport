import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import Select from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Alert, Stack } from '@mui/material';

import { addDriver } from '../../../lib/api-master';
import { mobileNoRegEx } from '../../../lib/helper';

const initialState = {
  name: '',
  correspondenceAddress: '',
  permanentAddress: '',
  dateOfBirth: null,
  phone: '',
  fatherName: '',
  referencedBy: '',
  eyeSight: '',
  licenseNo: '',
  licenseType: '',
  qualification: '',
  joiningDate: null,
  bloodGroup: '',
  renewDate: null,
  expiryDate: null,
  remark: ''
};

const initialErrorState = {
  name: {
    invalid: false,
    message: ''
  },
  phone: {
    invalid: false,
    message: ''
  },
  licenseNo: {
    invalid: false,
    message: ''
  }
};

const DriverAdd = () => {
  const [driver, setDriver] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);

  const navigate = useNavigate();

  const goToDriversList = useCallback(() => {
    navigate('/master/drivers');
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();

    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      addDriver(driver, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setDriver(initialState);
            goToDriversList();
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
  }, [isSubmitted, hasErrors, driver, goToDriversList]);

  const resetButtonHandler = () => {
    setDriver(initialState);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const backButtonHandler = () => {
    goToDriversList();
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDriver(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(driver));
    setIsSubmitted(true);
  };

  const dateInputChangeHandler = (name, date) => {
    setDriver(currState => {
      return {
        ...currState,
        [name]: new Date(date)
      };
    });
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.name.trim() === '') {
      errors.name = { invalid: true, message: 'Name is required' };
    }
    if (formData.phone.trim() === '') {
      errors.phone = { invalid: true, message: 'Phone is required' };
    }
    if (formData.phone.trim() !== '' && !(mobileNoRegEx.test(formData.phone))) {
      errors.phone = { invalid: true, message: 'Phone number should be 10 digits number' };
    }
    if (formData.licenseNo.trim() === '') {
      errors.licenseNo = { invalid: true, message: 'License no is required' };
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
    <h1 className='pageHead'>Add a driver</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}

    <form action='' onSubmit={submitHandler}>
      <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.name.invalid}>
              <TextField size='small' variant='outlined' label='Driver name' value={driver.name} error={formErrors.name.invalid} onChange={inputChangeHandler} name='name' id='name' />
              {formErrors.name.invalid && <FormHelperText>{formErrors.name.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Correspondence address' value={driver.correspondenceAddress} onChange={inputChangeHandler} name='correspondenceAddress' id='correspondenceAddress' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Permanent address' value={driver.permanentAddress} onChange={inputChangeHandler} name='permanentAddress' id='permanentAddress' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Date of birth'
                  inputFormat='DD/MM/YYYY'
                  value={driver.dateOfBirth}
                  disableFuture={true}
                  onChange={dateInputChangeHandler.bind(null, 'dateOfBirth')}
                  inputProps={{
                    readOnly: true
                  }}
                  renderInput={(params) => <TextField name='dateOfBirth' size='small' {...params} />}
                // renderInput={(params) => <TextField name='dateOfBirth' size='small' {...params} onFocus={e => e.target.blur()} />}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.phone.invalid}>
              <TextField size='small' variant='outlined' label='Phone' value={driver.phone} error={formErrors.phone.invalid} onChange={inputChangeHandler} name='phone' id='phone' />
              {formErrors.phone.invalid && <FormHelperText>{formErrors.phone.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Father name' value={driver.fatherName} onChange={inputChangeHandler} name='fatherName' id='fatherName' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Referenced by' value={driver.referencedBy} onChange={inputChangeHandler} name='referencedBy' id='referencedBy' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth size='small'>
              <InputLabel id='eyeSight'>Eyesight</InputLabel>
              <Select
                labelId='eyeSight'
                name='eyeSight'
                value={driver.eyeSight}
                label='Eyesight'
                onChange={inputChangeHandler}
              >
                <MenuItem key='normal' value='normal' className='menuItem'>Normal</MenuItem>
                <MenuItem key='good' value='good' className='menuItem'>Good</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.licenseNo.invalid}>
              <TextField size='small' variant='outlined' label='License no' value={driver.licenseNo} error={formErrors.licenseNo.invalid} onChange={inputChangeHandler} name='licenseNo' id='licenseNo' />
              {formErrors.licenseNo.invalid && <FormHelperText>{formErrors.licenseNo.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth size='small'>
              <InputLabel id='licenseType'>License type</InputLabel>
              <Select
                labelId='licenseType'
                name='licenseType'
                value={driver.licenseType}
                label='License type'
                onChange={inputChangeHandler}
              >
                <MenuItem key='Higher heavy' value='Higher heavy' className='menuItem'>Higher heavy</MenuItem>
                <MenuItem key='Heavy' value='Heavy' className='menuItem'>Heavy</MenuItem>
                <MenuItem key='Non-heavy' value='Non-heavy' className='menuItem'>Non-heavy</MenuItem>
                <MenuItem key='normal' value='normal' className='menuItem'>Normal</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Qualification' value={driver.qualification} onChange={inputChangeHandler} name='qualification' id='qualification' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Joining date'
                  inputFormat='DD/MM/YYYY'
                  value={driver.joiningDate}
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
            <FormControl fullWidth size='small'>
              <InputLabel id='bloodGroup'>Blood group</InputLabel>
              <Select
                labelId='bloodGroup'
                name='bloodGroup'
                value={driver.bloodGroup}
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
            <FormControl fullWidth error>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Renew date'
                  inputFormat='DD/MM/YYYY'
                  value={driver.renewDate}
                  onChange={dateInputChangeHandler.bind(null, 'renewDate')}
                  inputProps={{
                    readOnly: true
                  }}
                  renderInput={(params) => <TextField name='renewDate' size='small' {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Expiry date'
                  inputFormat='DD/MM/YYYY'
                  value={driver.expiryDate}
                  onChange={dateInputChangeHandler.bind(null, 'expiryDate')}
                  inputProps={{
                    readOnly: true
                  }}
                  renderInput={(params) => <TextField name='expiryDate' size='small' {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Remark' value={driver.remark} onChange={inputChangeHandler} name='remark' id='remark' />
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

export default DriverAdd;