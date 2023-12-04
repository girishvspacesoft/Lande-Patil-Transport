import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper, InputAdornment, FormControlLabel, Autocomplete } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import { Alert, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { getLoadingSlip, getLorryReceipt, updateLorryReceiptAck } from '../../../lib/api-transactions';
import LoadingSpinner from '../../UI/LoadingSpinner';
import { getFormattedLSNumber, getFormattedLRNumber } from '../../../lib/helper';
import { getBranches, getPlaces } from '../../../lib/api-master';

const DELIVERY_TYPES = [{ label: 'Door', value: 'Door' }, { label: 'Godown', value: 'Godown' }, { label: 'Office', value: 'Office' }];

const initialState = {
  associatedLS: '',
  branch: '',
  close: false,
  closeReason: '',
  collectAt: '',
  consignee: '',
  consignor: '',
  date: '',
  deliveryAt: '',
  deliveryCharges: 0,
  deliveryDate: null,
  deliveryInDays: 0,
  deliveryType: '',
  from: '',
  hamali: 0,
  invoiceNo: '',
  lrNo: 0,
  materialCost: 0,
  osc: 0,
  otherCharges: 0,
  payType: '',
  remark: '',
  serviceTaxBy: '',
  statistical: 0,
  status: 0,
  to: '',
  toBilled: '',
  total: 0,
  totalFreight: 0,
  transactions: [],
  unloadBranch: null,
  unloadDate: null,
  unloadTo: null,
  updatedAt: '',
  vehicleNo: '',
  wayBillNo: '',
  _id: ''
};

const initialErrorState = {
  unloadTo: {
    invalid: false,
    message: ''
  },
  unloadDate: {
    invalid: false,
    message: ''
  },
  unloadBranch: {
    invalid: false,
    message: ''
  }
};

const LRAcknowledgementEdit = () => {
  const [branches, setBranches] = useState([]);
  const [places, setPlaces] = useState([]);
  const [lorryReceipt, setLorryReceipt] = useState(initialState);
  const [updatedLorryReceipt, setUpdatedLorryReceipt] = useState(initialState);
  const [fetchedLorryReceipt, setFetchedLorryReceipt] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeliveryDisabled, setIsDeliveryDisabled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { lrId } = location.state;

  const goToLRAcknowledgement = useCallback(() => {
    navigate('/transactions/lrAcknowledgement');
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
          const updatedResponse = response.map(branch => {
            branch.label = branch.name;
            branch.value = branch._id;
            return branch;
          })
          setBranches(updatedResponse);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setHttpError(error.message);
      });

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
    if (lrId && !lorryReceipt._id) {
      setIsLoading(true);
      getLorryReceipt(lrId, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setLorryReceipt(response);
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
  }, [lrId, lorryReceipt._id]);

  // useEffect(() => {
  //   if (branches.length && places.length && lorryReceipt.collectAt && lorryReceipt.associatedLS.length) {
  //     const collectAt = places.filter(place => place.name === lorryReceipt.collectAt)[0];
  //     const unloadBranchIndex = branches.map(branch => branch._id).indexOf(lorryReceipt.unloadBranch);
  //     const unloadToIndex = DELIVERY_TYPES.map(type => type.value).indexOf(lorryReceipt.unloadTo);
  //     setUpdatedLorryReceipt(currState => {
  //       return {
  //         ...currState,
  //         collectAt: collectAt._id ? collectAt._id : lorryReceipt.collectAt,
  //         unloadBranch: unloadBranchIndex > -1 ? branches[unloadBranchIndex] : lorryReceipt.unloadBranch,
  //         unloadTo: unloadToIndex > -1 ? DELIVERY_TYPES[unloadToIndex] : lorryReceipt.unloadTo
  //       }
  //     });
  //   }
  // }, [places, branches, lorryReceipt.collectAt, lorryReceipt.unloadBranch, lorryReceipt.unloadTo, lorryReceipt.associatedLS]);

  useEffect(() => {
    const controller = new AbortController();
    if (lorryReceipt.associatedLS) {
      setIsLoading(true);
      getLoadingSlip(lorryReceipt.associatedLS, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            const updatedLR = { ...lorryReceipt };
            if (response._id) {
              updatedLR.associatedLS = response;
              updatedLR.lrNo = getFormattedLRNumber(updatedLR.lrNo);
              updatedLR.associatedLS.lsNo = getFormattedLSNumber(updatedLR.associatedLS.lsNo);
              updatedLR.deliveryDate = updatedLR.deliveryDate ? updatedLR.deliveryDate : null;
              updatedLR.unloadDate = updatedLR.unloadDate ? updatedLR.unloadDate : null;
              if (branches.length && places.length && updatedLR.collectAt) {
                const collectAt = places.filter(place => place.name === lorryReceipt.collectAt)[0];
                const unloadBranchIndex = branches.map(branch => branch._id).indexOf(lorryReceipt.unloadBranch);
                const unloadToIndex = DELIVERY_TYPES.map(type => type.value).indexOf(lorryReceipt.unloadTo);
                setUpdatedLorryReceipt(() => {
                  return {
                    ...updatedLR,
                    collectAt: collectAt._id ? collectAt._id : lorryReceipt.collectAt,
                    unloadBranch: unloadBranchIndex > -1 ? branches[unloadBranchIndex] : lorryReceipt.unloadBranch,
                    unloadTo: unloadToIndex > -1 ? DELIVERY_TYPES[unloadToIndex] : lorryReceipt.unloadTo
                  }
                });
                setFetchedLorryReceipt(() => {
                  return {
                    ...updatedLR,
                    collectAt: collectAt._id ? collectAt._id : lorryReceipt.collectAt,
                    unloadBranch: unloadBranchIndex > -1 ? branches[unloadBranchIndex] : lorryReceipt.unloadBranch,
                    unloadTo: unloadToIndex > -1 ? DELIVERY_TYPES[unloadToIndex] : lorryReceipt.unloadTo
                  }
                });
              }
            }
            //setUpdatedLorryReceipt(updatedLR);
            //setFetchedLorryReceipt(updatedLR);
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
  }, [lorryReceipt, places, branches]);

  //Save useEffect
  useEffect(() => {
    const controller = new AbortController();
    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      const updatedLR = JSON.parse(JSON.stringify(updatedLorryReceipt));
      updatedLR.unloadTo = updatedLR.unloadTo.value;
      setIsLoading(true);
      updateLorryReceiptAck(updatedLR, controller)
        .then(response => {
          if (response.message) {
            setIsLoading(false);
            setHttpError(response.message);
          } else {
            setHttpError('');
            setFormErrors(initialErrorState);
            setIsLoading(false);
            goToLRAcknowledgement();
          }
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
  }, [isSubmitted, hasErrors, updatedLorryReceipt, goToLRAcknowledgement]);

  useEffect(() => {
    if (!updatedLorryReceipt.unloadDate || !updatedLorryReceipt.unloadTo || !updatedLorryReceipt.unloadBranch) {
      setIsDeliveryDisabled(true);
      setUpdatedLorryReceipt(currState => {
        return {
          ...currState,
          deliveryDate: null,
          close: false,
          closeReason: ''
        }
      })
    } else {
      setIsDeliveryDisabled(false);
    }
  }, [updatedLorryReceipt.unloadDate, updatedLorryReceipt.unloadTo, updatedLorryReceipt.unloadBranch]);

  const resetButtonHandler = () => {
    setUpdatedLorryReceipt(fetchedLorryReceipt);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const backButtonHandler = () => {
    goToLRAcknowledgement();
  };

  const inputChangeHandler = (e, isChecked) => {
    const name = e.target.name;
    let value;
    if (typeof isChecked === 'boolean') {
      value = isChecked
    } else {
      value = e.target.value;
    }
    if (name === 'close' && isChecked === false) {
      setUpdatedLorryReceipt(currState => {
        return {
          ...currState,
          closeReason: ''
        };
      });
    }
    setUpdatedLorryReceipt(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(updatedLorryReceipt));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };

    if (!formData.unloadTo) {
      errors.unloadTo = { invalid: true, message: 'Unload to is required' };
    }
    if (!formData.unloadDate) {
      errors.unloadDate = { invalid: true, message: 'Unload date is required' };
    }
    if (!formData.unloadBranch) {
      errors.unloadBranch = { invalid: true, message: 'Unload branch is required' };
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

  const dateInputChangeHandler = (name, date) => {
    setUpdatedLorryReceipt(currState => {
      return {
        ...currState,
        [name]: new Date(date)
      };
    });
  };

  const clearDate = (name) => {
    setUpdatedLorryReceipt(currState => {
      return {
        ...currState,
        [name]: null
      };
    });
  };

  const autocompleteChangeListener = (e, option, name) => {
    setUpdatedLorryReceipt(currState => {
      return {
        ...currState,
        [name]: option
      };
    });
  };

  return <>
    {isLoading && <LoadingSpinner />}
    <h1 className='pageHead'>Update a lorry receipt acknowledgement</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}
    {updatedLorryReceipt._id && <form action='' onSubmit={submitHandler}>
      <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Lorry receipt no' value={updatedLorryReceipt.lrNo} name='lrNo' id='lrNo' inputProps={{ readOnly: true }} />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Way bill no' value={updatedLorryReceipt.wayBillNo} name='wayBillNo' id='wayBillNo' inputProps={{ readOnly: true }} />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Loading slip no' value={updatedLorryReceipt.associatedLS.lsNo} name='lsNo' id='lsNo' inputProps={{ readOnly: true }} />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.unloadTo.invalid}>
              <Autocomplete
                disablePortal
                autoSelect
                size='small'
                name="unloadTo"
                options={DELIVERY_TYPES}
                value={updatedLorryReceipt.unloadTo}
                onChange={(e, value) => autocompleteChangeListener(e, value, 'unloadTo')}
                openOnFocus
                renderInput={(params) => <TextField {...params} label="Unload to" error={formErrors.unloadTo.invalid} fullWidth />}
              />
              {formErrors.unloadTo.invalid && <FormHelperText>{formErrors.unloadTo.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <div className='bl_date'>
              <FormControl fullWidth error={formErrors.unloadDate.invalid}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    error={formErrors.unloadDate.invalid}
                    label='Unload date'
                    inputFormat='DD/MM/YYYY'
                    value={updatedLorryReceipt.unloadDate}
                    disableFuture={true}
                    onChange={dateInputChangeHandler.bind(null, 'unloadDate')}
                    inputProps={{
                      readOnly: true
                    }}
                    renderInput={(params) => <TextField name='date' size='small' {...params} error={formErrors.unloadDate.invalid} />}
                  />
                </LocalizationProvider>
                {formErrors.unloadDate.invalid && <FormHelperText>{formErrors.unloadDate.message}</FormHelperText>}
              </FormControl>
              <Button variant='text' size='medium' className='clearHandler' onClick={clearDate.bind(null, 'unloadDate')}>Clear</Button>
            </div>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.unloadBranch.invalid}>
              {/* <InputLabel id='unloadBranch'>Unload branch</InputLabel>
              <Select
                labelId='unloadBranch'
                name='unloadBranch'
                label='Unload branch'
                value={updatedLorryReceipt.unloadBranch}
                onChange={inputChangeHandler}
              >
                <MenuItem key='' value='' className='menuItem'>-Select-</MenuItem>
                {branches.length > 0 && branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
              </Select> */}
              <Autocomplete
                disablePortal
                autoSelect
                size='small'
                name="unloadBranch"
                options={branches}
                value={updatedLorryReceipt.unloadBranch}
                onChange={(e, value) => autocompleteChangeListener(e, value, 'unloadBranch')}
                openOnFocus
                renderInput={(params) => <TextField {...params} label="Unload branch" error={formErrors.unloadBranch.invalid} fullWidth />}
              />
              {formErrors.unloadBranch.invalid && <FormHelperText>{formErrors.unloadBranch.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <div className='bl_date'>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Delivery date'
                    inputFormat='DD/MM/YYYY'
                    disabled={isDeliveryDisabled}
                    value={updatedLorryReceipt.deliveryDate}
                    onChange={dateInputChangeHandler.bind(null, 'deliveryDate')}
                    inputProps={{
                      readOnly: true
                    }}
                    renderInput={(params) => <TextField name='deliveryDate' size='small' {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
              <Button variant='text' size='medium' className='clearHandler' onClick={clearDate.bind(null, 'deliveryDate')}>Clear</Button>
            </div>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Delivery place' value={updatedLorryReceipt.deliveryType} name='deliveryType' id='deliveryType' inputProps={{ readOnly: true }} />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Receivable amount' value={updatedLorryReceipt.total} name='total' id='total' InputProps={{
                readOnly: true,
                startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>
              }} />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Amount to be paid' value={updatedLorryReceipt.total} name='toBePaid' id='toBePaid' InputProps={{
                readOnly: true,
                startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>
              }} />
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth size='small'>
              <InputLabel id='payType'>Pay type</InputLabel>
              <Select
                labelId='payType'
                name='payType'
                label='Pay type'
                value={updatedLorryReceipt.payType}
                inputProps={{ readOnly: true }}
                onChange={inputChangeHandler}
              >
                <MenuItem key='TBB' value='TBB' className='menuItem'>TBB</MenuItem>
                <MenuItem key='ToPay' value='ToPay' className='menuItem'>ToPay</MenuItem>
                <MenuItem key='Paid' value='Paid' className='menuItem'>Paid</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth size='small'>
              <InputLabel id='toBilled'>To billed</InputLabel>
              <Select
                labelId='toBilled'
                name='toBilled'
                label='To billed'
                value={updatedLorryReceipt.toBilled}
                inputProps={{ readOnly: true }}
                onChange={inputChangeHandler}
              >
                <MenuItem key='Consignor' value='Consignor' className='menuItem'>Consignor</MenuItem>
                <MenuItem key='Consignee' value='Consignee' className='menuItem'>Consignee</MenuItem>
                <MenuItem key='Third party' value='Third party' className='menuItem'>Third party</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth size='small'>
              <InputLabel id='collectAt'>Collect at</InputLabel>
              <Select
                labelId='collectAt'
                name='collectAt'
                label='Collect at'
                value={updatedLorryReceipt.collectAt}
                inputProps={{ readOnly: true }}
                onChange={inputChangeHandler}
              >
                {places.length > 0 && places.map(place => <MenuItem key={place._id} value={place._id} className='menuItem'>{place.name}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControlLabel
              label="Close"
              control={
                <Checkbox
                  name='close'
                  disabled={isDeliveryDisabled}
                  checked={updatedLorryReceipt.close}
                  onChange={inputChangeHandler}
                />
              }
            />
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Closing reason' value={updatedLorryReceipt.closeReason} name='closeReason' id='closeReason' InputProps={{
                disabled: !updatedLorryReceipt.close
              }} onChange={inputChangeHandler} />
            </FormControl>
          </div>
        </div>
        <div className='right'>
          <Button variant='outlined' size='medium' onClick={backButtonHandler}>Back</Button>
          <Button variant='outlined' size='medium' onClick={resetButtonHandler} className='ml6'>Reset</Button>
          <Button variant='contained' size='medium' type='submit' color='primary' className='ml6'>Save</Button>
        </div>
      </Paper>
    </form>}
  </>;
};

export default LRAcknowledgementEdit;