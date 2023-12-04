import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { TextField, FormControl, FormHelperText, Button } from '@mui/material';
import { emailRegEx, mobileNoRegEx } from '../../../lib/helper';

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

const initialState = {
  name: '',
  address: '',
  designation: '',
  email: '',
  mobile: ''
};


const ContactPersonForm = ({ onContactPersonAdd, editContact }) => {
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [contactPerson, setContactPerson] = useState(initialState);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    if (!hasErrors && isSubmitted) {
      onContactPersonAdd(contactPerson);
      setIsSubmitted(false);
      setHasErrors(false);
      setFormErrors(initialErrorState);
      setContactPerson(initialState);
    }
  }, [hasErrors, isSubmitted, contactPerson, onContactPersonAdd]);

  useEffect(() => {
    if (editContact) {
      setContactPerson(editContact);
    }
  }, [editContact]);


  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setContactPerson(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.name.trim() === '') {
      errors.name = { invalid: true, message: 'Name is required' };
    }
    if (formData.mobile.trim() === '') {
      errors.mobile = { invalid: true, message: 'Mobile is required' };
    }
    if (formData.mobile.trim() !== '' && !(mobileNoRegEx.test(formData.mobile))) {
      errors.mobile = { invalid: true, message: 'Mobile number should be 10 digits number' };
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

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(contactPerson));
    setIsSubmitted(true);
  };

  return <form action='' id='contactPersonForm' onSubmit={submitHandler}>
    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant='h6' gutterBottom>
        Contact person
      </Typography>
      <div className='grid grid-3-col'>
        <div className='grid-item'>
          <FormControl fullWidth error={formErrors.name.invalid}>
            <TextField size='small' variant='outlined' label='Contact person name' value={contactPerson.name} error={formErrors.name.invalid} onChange={inputChangeHandler} name='name' id='name' />
            {formErrors.name.invalid && <FormHelperText>{formErrors.name.message}</FormHelperText>}
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth>
            <TextField size='small' variant='outlined' label='Address' value={contactPerson.address} onChange={inputChangeHandler} name='address' id='address' />
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth>
            <TextField size='small' variant='outlined' label='Designation' value={contactPerson.designation} onChange={inputChangeHandler} name='designation' id='designation' />
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth error={formErrors.email.invalid}>
            <TextField size='small' variant='outlined' label='Email' value={contactPerson.email} error={formErrors.email.invalid} onChange={inputChangeHandler} name='email' id='email' />
            {formErrors.email.invalid && <FormHelperText>{formErrors.email.message}</FormHelperText>}
          </FormControl>
        </div>
        <div className='grid-item'>
          <FormControl fullWidth error={formErrors.mobile.invalid}>
            <TextField size='small' variant='outlined' label='Mobile' value={contactPerson.mobile} error={formErrors.mobile.invalid} onChange={inputChangeHandler} name='mobile' id='mobile' />
            {formErrors.mobile.invalid && <FormHelperText>{formErrors.mobile.message}</FormHelperText>}
          </FormControl>
        </div>
      </div>
      <div className='right'>
        <Button variant='contained' size='medium' type='submit' color='primary' form='contactPersonForm'>{editContact ? 'Update' : 'Add'}</Button>
      </div>
    </Paper>
  </form>;
};

export default ContactPersonForm;