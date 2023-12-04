import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import Select from '@mui/material/Select';
import { Alert, Stack } from '@mui/material';

import { getBranch, getPlaces, updateBranch } from '../../../lib/api-master';
import LoadingSpinner from '../../UI/LoadingSpinner';


const initialBranchState = {
  branchCode: '',
  abbreviation: '',
  name: '',
  description: '',
  place: '',
  openingBalance: '',
  balanceType: ''
};

const initialErrorState = {
  abbreviation: {
    invalid: false,
    message: ''
  },
  name: {
    invalid: false,
    message: ''
  },
  place: {
    invalid: false,
    message: ''
  }
};

const BranchEdit = () => {
  const [branch, setBranch] = useState(initialBranchState);
  const [places, setPlaces] = useState([]);
  const [fetchedBranch, setFetchedBranch] = useState(initialBranchState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const { branchId } = location.state;

  const navigate = useNavigate();

  const goToBranchList = useCallback(() => {
    navigate('/master/branches');
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    getPlaces(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setPlaces(response);
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

    if (branchId && branchId !== '' && places.length) {
      setIsLoading(true);
      getBranch(branchId, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setBranch(response);
            setFetchedBranch(response);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError(error.message);
        });
    };

    return () => {
      controller.abort();
    };
  }, [branchId, places]);

  useEffect(() => {
    const controller = new AbortController();

    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      updateBranch(branch, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setBranch(initialBranchState);
            goToBranchList();
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
  }, [isSubmitted, hasErrors, branch, goToBranchList]);

  const resetButtonHandler = () => {
    setBranch(fetchedBranch);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBranch(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(branch));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.abbreviation.trim() === '') {
      errors.abbreviation = { invalid: true, message: 'Abbreviation is required' };
    }
    if (formData.name.trim() === '') {
      errors.name = { invalid: true, message: 'Branch name is required' };
    }
    if (!formData.place) {
      errors.place = { invalid: true, message: 'Place is required' };
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

  const cancelButtonHandler = () => {
    goToBranchList();
  };

  return <>

    {isLoading && <LoadingSpinner />}

    <h1 className='pageHead'>Edit a branch</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}
    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <form action='' onSubmit={submitHandler}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField variant='outlined' label='Branch code' value={branch.branchCode} onChange={inputChangeHandler} name='branchCode' id='branchCode' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.abbreviation.invalid}>
              <TextField variant='outlined' label='Abbreviation' error={formErrors.abbreviation.invalid} value={branch.abbreviation} onChange={inputChangeHandler} name='abbreviation' id='abbreviation' />
              {formErrors.abbreviation.invalid && <FormHelperText>{formErrors.abbreviation.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.name.invalid}>
              <TextField variant='outlined' label='Name' error={formErrors.name.invalid} value={branch.name} onChange={inputChangeHandler} name='name' id='name' />
              {formErrors.name.invalid && <FormHelperText>{formErrors.name.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField variant='outlined' label='Description' value={branch.description} onChange={inputChangeHandler} name='description' id='description' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.place.invalid}>
              <InputLabel id='place'>Place</InputLabel>
              <Select
                labelId='place'
                name='place'
                value={branch.place}
                label='Place'
                onChange={inputChangeHandler}
              >
                {places.map(place => <MenuItem key={place._id} value={place._id} className='menuItem'>{place.name}</MenuItem>)}
              </Select>
              {formErrors.place.invalid && <FormHelperText>{formErrors.place.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField variant='outlined' label='Opening balance' value={branch.openingBalance} onChange={inputChangeHandler} name='openingBalance' id='openingBalance' />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <InputLabel id='balanceType'>Balance type</InputLabel>
              <Select
                labelId='balanceType'
                name='balanceType'
                label='Balance type'
                value={branch.balanceType}
                onChange={inputChangeHandler}
              >
                <MenuItem value={'Credit'} className='menuItem'>Credit</MenuItem>
                <MenuItem value={'Debit'} className='menuItem'>Debit</MenuItem>
              </Select>
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

export default BranchEdit;