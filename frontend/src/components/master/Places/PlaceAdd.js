import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import { Alert, Stack } from '@mui/material';

import { addPlace } from '../../../lib/api-master';

const initialPlaceState = {
  name: '',
  abbreviation: ''
};

const initialErrorState = {
  name: {
    invalid: false,
    message: ''
  }
};

const PlaceAdd = () => {
  const [place, setPlace] = useState(initialPlaceState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);

  const navigate = useNavigate();

  const goToPlacesList = useCallback(() => {
    navigate('/master/places');
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();

    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      addPlace(place, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setPlace(initialPlaceState);
            goToPlacesList();
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
  }, [isSubmitted, hasErrors, place, goToPlacesList]);

  const resetButtonHandler = () => {
    setPlace(initialPlaceState);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const backButtonHandler = () => {
    goToPlacesList();
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPlace(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(place));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.name.trim() === '') {
      errors.name = { invalid: true, message: 'Place name is required' };
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
    <h1 className='pageHead'>Add a place</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}
    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <form action='' onSubmit={submitHandler}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.name.invalid}>
              <TextField size='small' variant='outlined' label='Place name' value={place.name} error={formErrors.name.invalid} onChange={inputChangeHandler} name='name' id='name' />
              {formErrors.name.invalid && <FormHelperText>{formErrors.name.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Place abbreviation' value={place.abbreviation} onChange={inputChangeHandler} name='abbreviation' id='abbreviation' />
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

export default PlaceAdd;