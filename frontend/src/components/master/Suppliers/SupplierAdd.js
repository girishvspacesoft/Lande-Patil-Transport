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
import { addSupplier } from '../../../lib/api-master';
import { emailRegEx, mobileNoRegEx, states } from '../../../lib/helper';

import ContactPersonList from '../ContactPerson/ContactPersonList';
import ContactPersonForm from '../ContactPerson/ContactPersonForm';

const useStyles = makeStyles(theme => ({
  menuPaper: {
    maxHeight: 300,
    maxWidth: 100
  }
}));

const initialState = {
  name: '',
  type: '',
  address: '',
  state: '',
  city: '',
  phone: '',
  email: '',
  panNo: '',
  vendorCode: '',
  vatNo: '',
  cstNo: '',
  eccNo: '',
  openingBalance: '',
  openingBalanceType: '',
  openingBalanceDate: null,
  closingBalance: '',
  closingBalanceType: '',
  closingBalanceDate: null,
  contactPerson: []
};

const initialErrorState = {
  name: {
    invalid: false,
    message: ''
  },
  type: {
    invalid: false,
    message: ''
  },
  phone: {
    invalid: false,
    message: ''
  },
  email: {
    invalid: false,
    message: ''
  },
  contactPerson: {
    invalid: false,
    message: ''
  }
};

const SupplierAdd = () => {
  const [supplier, setSupplier] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editContact, setEditContact] = useState(null);


  const classes = useStyles();

  const navigate = useNavigate();

  const goToSuppliersList = useCallback(() => {
    navigate('/master/suppliers');
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();

    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      addSupplier(supplier, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setSupplier(initialState);
            goToSuppliersList();
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
  }, [isSubmitted, hasErrors, supplier, goToSuppliersList]);

  const resetButtonHandler = () => {
    setSupplier(initialState);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const backButtonHandler = () => {
    goToSuppliersList();
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSupplier(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(supplier));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.name.trim() === '') {
      errors.name = { invalid: true, message: 'Customer name is required' };
    }
    if (formData.type.trim() === '') {
      errors.type = { invalid: true, message: 'Type is required' };
    }
    if (formData.phone.trim() === '') {
      errors.phone = { invalid: true, message: 'Phone is required' };
    }
    if (formData.phone.trim() !== '' && !(mobileNoRegEx.test(formData.phone))) {
      errors.phone = { invalid: true, message: 'Phone number should be 10 digits number' };
    }
    if (formData.email !== '' && !(emailRegEx.test(formData.email))) {
      errors.email = { invalid: true, message: 'Email is invalid' };
    }
    if (!formData.contactPerson.length) {
      errors.contactPerson = { invalid: true, message: 'At least one contact person is required' };
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

  const handleOnContactPersonAdd = (receivedPerson) => {
    if (!editContact) {
      setSupplier(currentState => {
        const currentSupplier = { ...currentState };
        currentSupplier.contactPerson.push(receivedPerson);
        return currentSupplier;
      });
    } else {
      const editedContact = { ...editContact };
      const updatedReceivedPerson = { ...receivedPerson };
      delete updatedReceivedPerson.index;
      setSupplier(currentState => {
        const currentSupplier = { ...currentState };
        const currentSupplierContacts = [...currentState.contactPerson];
        currentSupplierContacts[editedContact.index] = { ...updatedReceivedPerson };
        currentSupplier.contactPerson = [...currentSupplierContacts];
        return currentSupplier;
      });
      setEditContact(null);
    }
  };

  const handleTriggerEdit = (index) => {
    setEditContact({ ...supplier.contactPerson[index], index: index });
  };

  const handleTriggerDelete = (contactIndex) => {
    setSupplier(currentState => {
      const currentSupplier = { ...currentState };
      currentSupplier.contactPerson = currentSupplier.contactPerson.filter((contact, index) => index !== contactIndex);
      return currentSupplier;
    });
  };

  const dateInputChangeHandler = (name, date) => {
    setSupplier(currState => {
      return {
        ...currState,
        [name]: new Date(date)
      };
    });
  };

  return <>
    {isLoading && <LoadingSpinner />}

    <h1 className='pageHead'>Add a supplier</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}

    {!isLoading && <div>
      <form action='' id='supplierForm' onSubmit={submitHandler}>
        <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
          <div className='grid grid-6-col'>
            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.name.invalid}>
                <TextField size='small' variant='outlined' label='Name' value={supplier.name} error={formErrors.name.invalid} onChange={inputChangeHandler} name='name' id='name' />
                {formErrors.name.invalid && <FormHelperText>{formErrors.name.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth size='small' error={formErrors.type.invalid}>
                <InputLabel id='type'>Type</InputLabel>
                <Select
                  labelId='type'
                  name='type'
                  value={supplier.type}
                  label='Type'
                  MenuProps={{ classes: { paper: classes.menuPaper } }}
                  onChange={inputChangeHandler}
                >
                  <MenuItem key='Vehicle' value='Vehicle' className='menuItem' title='Vehicle'>Vehicle</MenuItem>
                  <MenuItem key='Garage' value='Garage' className='menuItem' title='Garage'>Garage</MenuItem>
                  <MenuItem key='Pump' value='Pump' className='menuItem' title='Pump'>Pump</MenuItem>
                </Select>
                {formErrors.type.invalid && <FormHelperText>{formErrors.type.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Address' value={supplier.address} onChange={inputChangeHandler} name='address' id='address' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth size='small'>
                <InputLabel id='branch'>State</InputLabel>
                <Select
                  labelId='state'
                  name='state'
                  value={supplier.state}
                  label='State'
                  MenuProps={{ classes: { paper: classes.menuPaper } }}
                  onChange={inputChangeHandler}
                >
                  {states.map(state => <MenuItem key={state} value={state} className='menuItem' title={state}>{state}</MenuItem>)}
                </Select>
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='City' value={supplier.city} onChange={inputChangeHandler} name='city' id='city' />
              </FormControl>
            </div>

            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.phone.invalid}>
                <TextField size='small' variant='outlined' label='Telephone' value={supplier.phone} error={formErrors.phone.invalid} onChange={inputChangeHandler} name='phone' id='phone' />
                {formErrors.phone.invalid && <FormHelperText>{formErrors.phone.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.email.invalid}>
                <TextField size='small' variant='outlined' label='Email' value={supplier.email} error={formErrors.email.invalid} onChange={inputChangeHandler} name='email' id='email' />
                {formErrors.email.invalid && <FormHelperText>{formErrors.email.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='PAN No' value={supplier.panNo} onChange={inputChangeHandler} name='panNo' id='panNo' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Vendor Code' value={supplier.vendorCode} onChange={inputChangeHandler} name='vendorCode' id='vendorCode' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='VAT No' value={supplier.vatNo} onChange={inputChangeHandler} name='vatNo' id='vatNo' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='CST No.' value={supplier.cstNo} onChange={inputChangeHandler} name='cstNo' id='cstNo' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='ECC No' value={supplier.eccNo} onChange={inputChangeHandler} name='eccNo' id='eccNo' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Opening balance' value={supplier.openingBalance} onChange={inputChangeHandler} name='openingBalance' id='openingBalance' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth size='small'>
                <InputLabel id='openingBalanceType'>Balance type</InputLabel>
                <Select
                  labelId='openingBalanceType'
                  name='openingBalanceType'
                  value={supplier.openingBalanceType}
                  label='Balance type'
                  MenuProps={{ classes: { paper: classes.menuPaper } }}
                  onChange={inputChangeHandler}
                >
                  <MenuItem key='Credit' value='Credit' className='menuItem'>Credit</MenuItem>
                  <MenuItem key='Debit' value='Debit' className='menuItem'>Debit</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Opening balance date'
                    inputFormat='DD/MM/YYYY'
                    value={supplier.openingBalanceDate}
                    disableFuture={true}
                    onChange={dateInputChangeHandler.bind(null, 'openingBalanceDate')}
                    inputProps={{
                      readOnly: true
                    }}
                    renderInput={(params) => <TextField name='openingBalanceDate' size='small' {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Closing balance' value={supplier.closingBalance} onChange={inputChangeHandler} name='closingBalance' id='closingBalance' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth size='small'>
                <InputLabel id='closingBalanceType'>Balance type</InputLabel>
                <Select
                  labelId='closingBalanceType'
                  name='closingBalanceType'
                  value={supplier.closingBalanceType}
                  label='Balance type'
                  MenuProps={{ classes: { paper: classes.menuPaper } }}
                  onChange={inputChangeHandler}
                >
                  <MenuItem key='Credit' value='Credit' className='menuItem'>Credit</MenuItem>
                  <MenuItem key='Debit' value='Debit' className='menuItem'>Debit</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Closing balance date'
                    inputFormat='DD/MM/YYYY'
                    value={supplier.closingBalanceDate}
                    disableFuture={true}
                    onChange={dateInputChangeHandler.bind(null, 'closingBalanceDate')}
                    inputProps={{
                      readOnly: true
                    }}
                    renderInput={(params) => <TextField name='closingBalanceDate' size='small' {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
          </div>
        </Paper>
      </form>

      <div className='bl_contact_person'>
        <div className='bl_form'>
          <ContactPersonForm onContactPersonAdd={handleOnContactPersonAdd} editContact={editContact} />
        </div>
        <div className='bl_content'>
          {formErrors.contactPerson.invalid && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
            <Alert severity='error'>{formErrors.contactPerson.message}</Alert>
          </Stack>}
          <ContactPersonList contactPersons={supplier.contactPerson} handleTriggerEdit={handleTriggerEdit} handleTriggerDelete={handleTriggerDelete} />
        </div>
      </div>
      <div className='right'>
        <Button variant='outlined' size='medium' onClick={backButtonHandler}>Back</Button>
        <Button variant='outlined' size='medium' onClick={resetButtonHandler} className='ml6'>Reset</Button>
        <Button variant='contained' size='medium' type='submit' color='primary' form='supplierForm' className='ml6'>Save</Button>
      </div>
    </div>}
  </>;
};

export default SupplierAdd;