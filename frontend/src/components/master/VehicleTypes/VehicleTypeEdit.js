import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import { Alert, Stack } from '@mui/material';

import { getVehicleType, updateVehicleType } from '../../../lib/api-master';

const initialState = {
  type: '',
  tyreQuantity: ''
};

const initialErrorState = {
  type: {
    invalid: false,
    message: ''
  },
  tyreQuantity: {
    invalid: false,
    message: ''
  }
};

const VehicleTypeEdit = () => {
  const [vehicleType, setVehicleType] = useState(initialState);
  const [fetchedVehicleType, setFetchedVehicleType] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { vehicleTypeId } = location.state;

  const goToVehicleTypesList = useCallback(() => {
    navigate('/master/vehicleTypes');
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();

    getVehicleType(vehicleTypeId, controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setVehicleType(response);
          setFetchedVehicleType(response);
        }
        setIsSubmitted(false);
      })
      .catch(error => {
        setHttpError(error.message);
      });

    return () => {
      controller.abort();
    };
  }, [vehicleTypeId]);

  useEffect(() => {
    const controller = new AbortController();

    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      updateVehicleType(vehicleType, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setVehicleType(response);
            setFetchedVehicleType(response);
            goToVehicleTypesList();
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
  }, [isSubmitted, hasErrors, vehicleType, goToVehicleTypesList]);

  const resetButtonHandler = () => {
    setVehicleType(fetchedVehicleType);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const cancelButtonHandler = () => {
    goToVehicleTypesList();
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setVehicleType(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(vehicleType));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.type.trim() === '') {
      errors.type = { invalid: true, message: 'Vehicle type is required' };
    }
    if (isNaN(formData.tyreQuantity)) {
      errors.tyreQuantity = { invalid: true, message: 'Tyre quantity should be a number' };
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
    <h1 className='pageHead'>Add an article</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}
    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <form action='' onSubmit={submitHandler}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.type.invalid}>
              <TextField size='small' variant='outlined' label='Vehicle type' value={vehicleType.type} error={formErrors.type.invalid} onChange={inputChangeHandler} name='type' id='type' />
              {formErrors.type.invalid && <FormHelperText>{formErrors.type.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.tyreQuantity.invalid}>
              <TextField size='small' variant='outlined' label='Tyre quantity' value={vehicleType.tyreQuantity} error={formErrors.tyreQuantity.invalid} onChange={inputChangeHandler} name='tyreQuantity' id='tyreQuantity' />
              {formErrors.tyreQuantity.invalid && <FormHelperText>{formErrors.tyreQuantity.message}</FormHelperText>}
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

export default VehicleTypeEdit;