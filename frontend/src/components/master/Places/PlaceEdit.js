import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import { Alert, Stack } from '@mui/material';

import { getPlace, updatePlace } from '../../../lib/api-master';


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

const PlaceEdit = () => {
  const [place, setPlace] = useState(initialPlaceState);
  const [fetchedPlace, setFetchedPlace] = useState(initialPlaceState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);

  const location = useLocation();
  const { placeId } = location.state;

  const navigate = useNavigate();

  const goToPlaceList = useCallback(() => {
    navigate('/master/places');
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();

    if (placeId && placeId !== '') {
      getPlace(placeId, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setPlace(response);
            setFetchedPlace(response);
          }
        })
        .catch(error => {
          setHttpError(error.message);
        });
    };

    return () => {
      controller.abort();
    };
  }, [placeId]);

  useEffect(() => {
    const controller = new AbortController();

    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      updatePlace(place, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setPlace(initialPlaceState);
            goToPlaceList();
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
  }, [isSubmitted, hasErrors, place, goToPlaceList]);

  const resetButtonHandler = () => {
    setPlace(fetchedPlace);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
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

  const backButtonHandler = () => {
    goToPlaceList();
  };

  return <>
    <h1 className='pageHead'>Edit a place</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}
    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <form action='' onSubmit={submitHandler}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.name.invalid}>
              <TextField variant='outlined' label='Name' error={formErrors.name.invalid} value={place.name} onChange={inputChangeHandler} name='name' id='name' />
              {formErrors.name.invalid && <FormHelperText>{formErrors.name.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField variant='outlined' label='Place abbreviation' value={place.abbreviation} onChange={inputChangeHandler} name='abbreviation' id='abbreviation' />
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

export default PlaceEdit;