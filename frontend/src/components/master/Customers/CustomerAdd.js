import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button } from '@mui/material';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import { Alert, Stack } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import LoadingSpinner from '../../UI/LoadingSpinner';
import { addCustomer, getBranches } from '../../../lib/api-master';
import { states } from '../../../lib/helper';

import ContactPersonList from '../ContactPerson/ContactPersonList';
import ContactPersonForm from '../ContactPerson/ContactPersonForm';

const useStyles = makeStyles(theme => ({
  menuPaper: {
    maxHeight: 300,
    maxWidth: 100
  }
}));

const CustomerAdd = () => {
  const initialState = useMemo(() => {
    return {
      branch: '',
      type: '',
      name: '',
      address: '',
      phone: '',
      fax: '',
      cstNo: '',
      gstNo: '',
      state: '',
      city: '',
      email: '',
      vendorCode: '',
      vatNo: '',
      eccNo: '',
      openingBalance: '',
      openingBalanceType: '',
      closingBalance: '',
      closingBalanceType: '',
      contactPerson: []
    }
  }, []);

  const initialErrorState = {
    name: {
      invalid: false,
      message: ''
    },
    type: {
      invalid: false,
      message: ''
    }
  };
  const [customer, setCustomer] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [branches, setBranches] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editContact, setEditContact] = useState(null);


  const classes = useStyles();

  const navigate = useNavigate();

  const goToCustomersList = useCallback(() => {
    navigate('/master/customers');
  }, [navigate]);


  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    getBranches(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setBranches(response);
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
      addCustomer(customer, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setCustomer(initialState);
            goToCustomersList();
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
  }, [isSubmitted, hasErrors, customer, goToCustomersList, initialState]);

  const resetButtonHandler = () => {
    setCustomer(initialState);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCustomer(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(customer));
    setIsSubmitted(true);
  };

  const backButtonHandler = () => {
    goToCustomersList();
  }

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.name.trim() === '') {
      errors.name = { invalid: true, message: 'Customer name is required' };
    }
    if (formData.type.trim() === '') {
      errors.type = { invalid: true, message: 'Customer type is required' };
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
      setCustomer(currentState => {
        const currentCustomer = { ...currentState };
        currentCustomer.contactPerson.push(receivedPerson);
        return currentCustomer;
      });
    } else {
      const editedContact = { ...editContact };
      const updatedReceivedPerson = { ...receivedPerson };
      delete updatedReceivedPerson.index;
      setCustomer(currentState => {
        const currentCustomer = { ...currentState };
        const currentCustomerContacts = [...currentState.contactPerson];
        currentCustomerContacts[editedContact.index] = { ...updatedReceivedPerson };
        currentCustomer.contactPerson = [...currentCustomerContacts];
        return currentCustomer;
      });
      setEditContact(null);
    }
  };

  const handleTriggerEdit = (index) => {
    setEditContact({ ...customer.contactPerson[index], index: index });
  };

  const handleTriggerDelete = (contactIndex) => {
    setCustomer(currentState => {
      const currentCustomer = { ...currentState };
      currentCustomer.contactPerson = currentCustomer.contactPerson.filter((contact, index) => index !== contactIndex);
      return currentCustomer;
    });
  };

  return <>
    {isLoading && <LoadingSpinner />}

    <h1 className='pageHead'>Add a customer</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}

    {!isLoading && <div>
      <form action='' id='customerForm' onSubmit={submitHandler}>
        <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
          <div className='grid grid-6-col'>
            <div className='grid-item'>
              <FormControl fullWidth size='small'>
                <InputLabel id='branch'>Branch</InputLabel>
                <Select
                  labelId='branch'
                  name='branch'
                  value={customer.branch}
                  label='Branch'
                  onChange={inputChangeHandler}
                >
                  {branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
                </Select>
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth size='small' error={formErrors.type.invalid}>
                <InputLabel id='type'>Type</InputLabel>
                <Select
                  labelId='type'
                  name='type'
                  value={customer.type}
                  label='Type'
                  onChange={inputChangeHandler}
                >
                  <MenuItem value="Consignor" className='menuItem'>Consignor</MenuItem>
                  <MenuItem value="Consignee" className='menuItem'>Consignee</MenuItem>
                </Select>
                {formErrors.type.invalid && <FormHelperText>{formErrors.type.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth error={formErrors.name.invalid}>
                <TextField size='small' variant='outlined' label='Name' value={customer.name} error={formErrors.name.invalid} onChange={inputChangeHandler} name='name' id='name' />
                {formErrors.name.invalid && <FormHelperText>{formErrors.name.message}</FormHelperText>}
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Correspondence address' value={customer.address} onChange={inputChangeHandler} name='address' id='address' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Telephone' value={customer.phone} onChange={inputChangeHandler} name='phone' id='phone' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Fax No' value={customer.fax} onChange={inputChangeHandler} name='fax' id='fax' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='CST No.' value={customer.cstNo} onChange={inputChangeHandler} name='cstNo' id='cstNo' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='GST No.' value={customer.gstNo} onChange={inputChangeHandler} name='gstNo' id='gstNo' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth size='small'>
                <InputLabel id='branch'>State</InputLabel>
                <Select
                  labelId='state'
                  name='state'
                  value={customer.state}
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
                <TextField size='small' variant='outlined' label='City' value={customer.city} onChange={inputChangeHandler} name='city' id='city' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Email' value={customer.email} onChange={inputChangeHandler} name='email' id='email' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Vendor Code' value={customer.vendorCode} onChange={inputChangeHandler} name='vendorCode' id='vendorCode' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='VAT No' value={customer.vatNo} onChange={inputChangeHandler} name='vatNo' id='vatNo' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='ECC No' value={customer.eccNo} onChange={inputChangeHandler} name='eccNo' id='eccNo' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Opening balance' value={customer.openingBalance} onChange={inputChangeHandler} name='openingBalance' id='openingBalance' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth size='small'>
                <InputLabel id='openingBalanceType'>Balance type</InputLabel>
                <Select
                  labelId='openingBalanceType'
                  name='openingBalanceType'
                  value={customer.openingBalanceType}
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
              <FormControl fullWidth>
                <TextField size='small' variant='outlined' label='Closing balance' value={customer.closingBalance} onChange={inputChangeHandler} name='closingBalance' id='closingBalance' />
              </FormControl>
            </div>
            <div className='grid-item'>
              <FormControl fullWidth size='small'>
                <InputLabel id='closingBalanceType'>Balance type</InputLabel>
                <Select
                  labelId='closingBalanceType'
                  name='closingBalanceType'
                  value={customer.closingBalanceType}
                  label='Balance type'
                  MenuProps={{ classes: { paper: classes.menuPaper } }}
                  onChange={inputChangeHandler}
                >
                  <MenuItem key='Credit' value='Credit' className='menuItem'>Credit</MenuItem>
                  <MenuItem key='Debit' value='Debit' className='menuItem'>Debit</MenuItem>
                </Select>
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
          <ContactPersonList contactPersons={customer.contactPerson} handleTriggerEdit={handleTriggerEdit} handleTriggerDelete={handleTriggerDelete} />
        </div>
      </div>
      <div className='right'>
        <Button variant='outlined' size='medium' onClick={backButtonHandler}>Back</Button>
        <Button variant='outlined' size='medium' onClick={resetButtonHandler} className='ml6'>Reset</Button>
        <Button variant='contained' size='medium' type='submit' color='primary' form='customerForm' className='ml6'>Save</Button>
      </div>
    </div>}
  </>;
};

export default CustomerAdd;