import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button } from '@mui/material';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import { Alert, Stack } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import LoadingSpinner from '../../UI/LoadingSpinner';
import { addVehicle, getVehicleTypes, getSuppliers } from '../../../lib/api-master';

import TaxDetailForm from '../TaxDetails/TaxDetailForm';
import TaxDetailList from '../TaxDetails/TaxDetailList';

const useStyles = makeStyles(theme => ({
  menuPaper: {
    maxHeight: 300,
    maxWidth: 100
  }
}));

const initialState = {
  owner: '',
  vehicleType: '',
  vehicleNo: '',
  capacity: '',
  make: '',
  description: '',
  regDate: null,
  expDate: null,
  engineNo: '',
  chassisNo: '',
  pucNo: '',
  pucExpDate: null,
  body: '',
  taxDetails: []
};

const initialErrorState = {
  owner: {
    invalid: false,
    message: ''
  },
  vehicleType: {
    invalid: false,
    message: ''
  },
  vehicleNo: {
    invalid: false,
    message: ''
  },
  taxDetails: {
    invalid: false,
    message: ''
  }
};

const VehicleAdd = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [vehicle, setVehicle] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editTax, setEditTax] = useState(null);


  const classes = useStyles();

  const navigate = useNavigate();

  const goToVehiclesList = useCallback(() => {
    navigate('/master/vehicles');
  }, [navigate]);


  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    getSuppliers(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setSuppliers(response);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setHttpError(error.message);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    getVehicleTypes(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setVehicleTypes(response);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setHttpError(error.message);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      addVehicle(vehicle, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setVehicle(initialState);
            goToVehiclesList();
          }
          setIsLoading(false);
          setIsSubmitted(false);
        })
        .catch(error => {
          setIsLoading(false);
          setIsSubmitted(false);
          setHttpError(error.message);
        });
    }

    return () => {
      controller.abort();
    };
  }, [isSubmitted, hasErrors, vehicle, goToVehiclesList]);

  const resetButtonHandler = () => {
    setVehicle(initialState);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const backButtonHandler = () => {
    goToVehiclesList();
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setVehicle(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const dateInputChangeHandler = (name, date) => {
    setVehicle(currState => {
      return {
        ...currState,
        [name]: new Date(date)
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(vehicle));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.owner === '') {
      errors.owner = { invalid: true, message: 'Owner is required' };
    }
    if (formData.type === '') {
      errors.type = { invalid: true, message: 'Vehicle type is required' };
    }
    if (formData.vehicleNo.trim() === '') {
      errors.vehicleNo = { invalid: true, message: 'Vehicle number is required' };
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

  const handleOnTaxDetailAdd = (receivedTaxDetail) => {
    if (!editTax) {
      setVehicle(currentState => {
        const currentVehicle = { ...currentState };
        currentVehicle.taxDetails.push(receivedTaxDetail);
        return currentVehicle;
      });
    } else {
      const editedTaxDetail = { ...editTax };
      const updatedReceivedTaxDetail = { ...receivedTaxDetail };
      delete updatedReceivedTaxDetail.index;
      setVehicle(currentState => {
        const currentVehicle = { ...currentState };
        const currentVehicleTaxDetails = [...currentState.taxDetails];
        currentVehicleTaxDetails[editedTaxDetail.index] = { ...updatedReceivedTaxDetail };
        currentVehicle.taxDetails = [...currentVehicleTaxDetails];
        return currentVehicle;
      });
      setEditTax(null);
    }
  };

  const handleTriggerEdit = (index) => {
    setEditTax({ ...vehicle.taxDetails[index], index: index });
  };

  const handleTriggerDelete = (contactIndex) => {
    setVehicle(currentState => {
      const currentVehicle = { ...currentState };
      currentVehicle.taxDetails = currentVehicle.taxDetails.filter((contact, index) => index !== contactIndex);
      return currentVehicle;
    });
  };

  return <>
    {isLoading && <LoadingSpinner />}

    <h1 className='pageHead'>Add a vehicle</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}

    {!isLoading && <div>
      <form action='' id='vehicleForm' onSubmit={submitHandler}>
        <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
          <div className='grid grid-6-col'>
            <div className='grid-item'>
              <FormControl fullWidth size='small' error={formErrors.owner.invalid}>
                <InputLabel id='vehicleOwner'>Vehicle owner</InputLabel>
                <Select
                  labelId='vehicleOwner'
                  name='owner'
                  value={vehicle.owner}
                  label='Vehicle owner'
                  onChange={inputChangeHandler}
                >
                  {suppliers.map(supplier => <MenuItem key={supplier._id} value={supplier._id} className='menuItem'>{supplier.name}</MenuItem>)}
                </Select>
                {formErrors.owner.invalid && <FormHelperText>{formErrors.owner.message}</FormHelperText>}
              </FormControl>
            </div>

            <div className='grid-item'>
              <FormControl fullWidth size='small' error={formErrors.vehicleType.invalid}>
                <InputLabel id='vehicleType'>Vehicle type</InputLabel>
                <Select
                  labelId='vehicleType'
                  name='vehicleType'
                  value={vehicle.vehicleType}
                  label='Vehicle type'
                  onChange={inputChangeHandler}
                >
                  {vehicleTypes.map(vehicleType => <MenuItem key={vehicleType._id} value={vehicleType._id} className='menuItem'>{vehicleType.type}</MenuItem>)}
                </Select>
                {formErrors.vehicleType.invalid && <FormHelperText>{formErrors.vehicleType.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.vehicleNo.invalid}>
                <TextField size='small' variant='outlined' label='Vehicle number' value={vehicle.vehicleNo} error={formErrors.vehicleNo.invalid} onChange={inputChangeHandler} name='vehicleNo' id='vehicleNo' />
                {formErrors.vehicleNo.invalid && <FormHelperText>{formErrors.vehicleNo.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Capacity' value={vehicle.capacity} onChange={inputChangeHandler} name='capacity' id='capacity' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Make' value={vehicle.make} onChange={inputChangeHandler} name='make' id='make' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Description' value={vehicle.description} onChange={inputChangeHandler} name='description' id='description' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Registration date'
                    inputFormat='DD/MM/YYYY'
                    value={vehicle.regDate}
                    onChange={dateInputChangeHandler.bind(null, 'regDate')}
                    inputProps={{
                      readOnly: true
                    }}
                    renderInput={(params) => <TextField name='regDate' size='small' {...params} />}
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
                    value={vehicle.expDate}
                    onChange={dateInputChangeHandler.bind(null, 'expDate')}
                    inputProps={{
                      readOnly: true
                    }}
                    renderInput={(params) => <TextField name='expDate' size='small' {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Engine number' value={vehicle.engineNo} onChange={inputChangeHandler} name='engineNo' id='engineNo' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Chassis number' value={vehicle.chassisNo} onChange={inputChangeHandler} name='chassisNo' id='chassisNo' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='PUC number' value={vehicle.pucNo} onChange={inputChangeHandler} name='pucNo' id='pucNo' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='PUC expiry date'
                    inputFormat='DD/MM/YYYY'
                    value={vehicle.pucExpDate}
                    onChange={dateInputChangeHandler.bind(null, 'pucExpDate')}
                    inputProps={{
                      readOnly: true
                    }}
                    renderInput={(params) => <TextField name='pucExpDate' size='small' {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth size='small'>
                <InputLabel id='body'>Body</InputLabel>
                <Select
                  labelId='body'
                  name='body'
                  value={vehicle.body}
                  label='Body'
                  MenuProps={{ classes: { paper: classes.menuPaper } }}
                  onChange={inputChangeHandler}
                >
                  <MenuItem key='Open' value='Open' className='menuItem'>Open</MenuItem>
                  <MenuItem key='Close' value='Close' className='menuItem'>Close</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </Paper>
      </form>

      <div className='bl_contact_person'>
        <div className='bl_form'>
          <TaxDetailForm onTaxDetailAdd={handleOnTaxDetailAdd} editTaxDetail={editTax} />
        </div>
        <div className='bl_content'>
          <TaxDetailList taxDetails={vehicle.taxDetails} handleTriggerEdit={handleTriggerEdit} handleTriggerDelete={handleTriggerDelete} />
        </div>
      </div>
      <div className='right'>
        <Button variant='outlined' size='medium' onClick={backButtonHandler}>Back</Button>
        <Button variant='outlined' size='medium' onClick={resetButtonHandler} className='ml6'>Reset</Button>
        <Button variant='contained' size='medium' type='submit' color='primary' form='vehicleForm' className='ml6'>Save</Button>
      </div>
    </div>}
  </>;
};

export default VehicleAdd;