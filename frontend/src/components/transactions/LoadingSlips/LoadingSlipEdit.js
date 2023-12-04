import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper, Divider, Autocomplete } from '@mui/material';
import Select from '@mui/material/Select';
import { Alert, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { getDataForLS } from '../../../lib/api-master';
import { getLorryReceipts, updateLoadingSlip, getLoadingSlip } from '../../../lib/api-transactions';
import LoadingSpinner from '../../UI/LoadingSpinner';
import { mobileNoRegEx } from '../../../lib/helper';
import FreightDetailsEdit from './Freight-Details/FreightDetailsEdit';

const initialState = {
  branch: '',
  date: new Date(),
  vehicle: null,
  vehicleNo: '',
  vehicleOwner: '',
  vehicleOwnerAddress: '',
  driver: null,
  driverName: '',
  licenseNo: '',
  mobile: '',
  from: null,
  to: null,
  lrList: [],
  toPay: 0,
  billed: 0,
  hire: 0,
  advance: 0,
  commission: 0,
  hamali: 0,
  stacking: 0,
  total: 0,
  ackBranch: null,
  remark: ''
};

const initialErrorState = {
  branch: {
    invalid: false,
    message: ''
  },
  date: {
    invalid: false,
    message: ''
  },
  vehicle: {
    invalid: false,
    message: ''
  },
  vehicleOwner: {
    invalid: false,
    message: ''
  },
  vehicleOwnerAddress: {
    invalid: false,
    message: ''
  },
  driver: {
    invalid: false,
    message: ''
  },
  licenseNo: {
    invalid: false,
    message: ''
  },
  mobile: {
    invalid: false,
    message: ''
  },
  from: {
    invalid: false,
    message: ''
  },
  to: {
    invalid: false,
    message: ''
  },
  lrList: {
    invalid: false,
    message: ''
  },
  toPay: {
    invalid: false,
    message: ''
  },
  billed: {
    invalid: false,
    message: ''
  },
  hire: {
    invalid: false,
    message: ''
  },
  advance: {
    invalid: false,
    message: ''
  },
  commission: {
    invalid: false,
    message: ''
  },
  hamali: {
    invalid: false,
    message: ''
  },
  stacking: {
    invalid: false,
    message: ''
  },
  total: {
    invalid: false,
    message: ''
  },
  ackBranch: {
    invalid: false,
    message: ''
  }
};

const LoadingSlipEdit = () => {
  const [branches, setBranches] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [lorryReceipts, setLorryReceipts] = useState([]);
  const [loadingSlip, setLoadingSlip] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lsLrList, setLsLrList] = useState([]);
  const [updatedLrList, setUpdatedLRList] = useState([]);
  const [isLocalMemo, setIsLocalMemo] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { lsId } = location.state;

  const goToLoadingSlips = useCallback(() => {
    navigate('/transactions/loadingSlips');
  }, [navigate]);

  const goToLocalMemo = useCallback(() => {
    navigate('/transactions/localMemoList');
  }, [navigate]);

  useEffect(() => {

    if (location.pathname) {
      location.pathname.endsWith('editLocalMemoLS') ? setIsLocalMemo(true) : setIsLocalMemo(false)
    }

    const controller = new AbortController();
    setIsLoading(true);
    getDataForLS(controller)
      .then(response => {
        setIsLoading(false);
        if (response.length && response.length === 6) {
          const updatedBranches = response[0].map(branch => {
            branch.label = branch.name;
            branch.value = branch._id;
            return branch;
          });
          setBranches(updatedBranches);
          const updatedVehicles = response[1].map(vehicle => {
            vehicle.label = vehicle.vehicleNo;
            vehicle.value = vehicle.vehicleNo;
            return vehicle;
          });
          setVehicles(updatedVehicles);
          setSuppliers(response[2]);
          const updatedPlaces = response[3].map(place => {
            place.label = place.name;
            place.value = place._id;
            return place;
          })
          setPlaces(updatedPlaces);
          const updatedDrivers = response[4].map(driver => {
            driver.label = driver.name;
            driver.value = driver.name;
            return driver;
          });
          setDrivers(updatedDrivers);
          setCustomers(response[5]);
          if (response[0].length) {
            setLoadingSlip(currState => {
              return {
                ...currState,
                branch: response[0][0]._id
              }
            })
          }
        } else {
          setHttpError('Something went wrong! Please try later or contact Administrator.')
        }
      })
      .catch(error => {
        setIsLoading(false);
        setHttpError('Something went wrong! Please try later or contact Administrator.')
      });
    return () => {
      controller.abort();
    };
  }, [location.pathname]);

  useEffect(() => {
    const controller = new AbortController();
    if (loadingSlip.branch) {
      setIsLoading(true);
      getLorryReceipts(loadingSlip.branch, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            const lrList = response.map(lr => {
              return {
                ...lr,
                checked: false
              }
            });
            const filteredLorryReceipts = lrList.filter(lr => {
              return !lr.associatedLS || lr.associatedLS === lsId;
            });
            setLorryReceipts(filteredLorryReceipts);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.')
        });
    };

    return () => {
      controller.abort();
    };
  }, [loadingSlip.branch, lsId]);

  useEffect(() => {
    const controller = new AbortController();
    if (lsId && vehicles.length && drivers.length) {
      setIsLoading(true);
      getLoadingSlip(lsId, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setFormErrors(initialErrorState);
            const vehicleIndex = vehicles.map(vehicle => vehicle.vehicleNo).indexOf(response.vehicleNo);
            response.vehicle = vehicles[vehicleIndex];
            const driverIndex = drivers.map(driver => driver.licenseNo).indexOf(response.licenseNo);
            response.driver = drivers[driverIndex];
            const fromIndex = places.map(place => place._id).indexOf(response.from);
            response.from = places[fromIndex];
            const toIndex = places.map(place => place._id).indexOf(response.to);
            response.to = places[toIndex];
            const ackBranchIndex = branches.map(branch => branch._id).indexOf(response.ackBranch);
            response.ackBranch = branches[ackBranchIndex];
            setLoadingSlip(response);
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
  }, [lsId, vehicles, drivers, places, branches]);

  useEffect(() => {
    if (lorryReceipts.length && loadingSlip.lrList.length) {
      const selectedLRList = lorryReceipts.map(lorryReceipt => {
        return {
          ...lorryReceipt,
          checked: loadingSlip.lrList.some(lr => {
            return lr._id === lorryReceipt._id;
          })
        };
      });
      setLsLrList(selectedLRList);
    }
  }, [lorryReceipts, loadingSlip.lrList]);

  //Save useEffect
  useEffect(() => {
    const controller = new AbortController();
    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      const updatedLoadingSlip = { ...loadingSlip };
      updatedLoadingSlip.lrList = lsLrList.filter(lr => lr.checked);
      updateLoadingSlip(updatedLoadingSlip, controller)
        .then(response => {
          if (response.message) {
            setIsLoading(false);
            setHttpError(response.message);
          } else {
            setHttpError('');
            setFormErrors(initialErrorState);
            setLoadingSlip(initialState);
            setIsLoading(false);
            if (isLocalMemo) {
              goToLocalMemo();
            } else {
              goToLoadingSlips();
            }
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
  }, [isSubmitted, hasErrors, loadingSlip, goToLoadingSlips, lsLrList, isLocalMemo, goToLocalMemo]);

  const resetButtonHandler = () => {
    setLoadingSlip(initialState);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const backButtonHandler = () => {
    if (isLocalMemo) {
      goToLocalMemo();
    } else {
      goToLoadingSlips();
    }
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoadingSlip(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(loadingSlip));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.branch.trim() === '') {
      errors.branch = { invalid: true, message: 'Branch is required' };
    }
    if (!formData.date) {
      errors.date = { invalid: true, message: 'Date is required' };
    }
    if (!formData.vehicle) {
      errors.vehicle = { invalid: true, message: 'Vehicle is required' };
    }
    if (formData.vehicleOwner.trim() === '') {
      errors.vehicleOwner = { invalid: true, message: 'Vehicle owner is required' };
    }
    if (formData.vehicleOwnerAddress.trim() === '') {
      errors.vehicleOwnerAddress = { invalid: true, message: 'Vehicle owner address is required' };
    }
    if (!formData.driver) {
      errors.driver = { invalid: true, message: 'Driver name is required' };
    }
    if (formData.licenseNo.trim() === '') {
      errors.licenseNo = { invalid: true, message: 'License no is required' };
    }
    if (formData.mobile.trim() === '') {
      errors.mobile = { invalid: true, message: 'Mobile no is required' };
    }
    if (formData.mobile && formData.mobile.trim() !== '' && !(mobileNoRegEx.test(formData.mobile))) {
      errors.mobile = { invalid: true, message: 'Mobile no should be 10 digits number' };
    }
    if (!formData.from) {
      errors.from = { invalid: true, message: 'From is required' };
    }
    if (!formData.to) {
      errors.to = { invalid: true, message: 'To is required' };
    }
    if (!formData.lrList.length) {
      errors.lrList = { invalid: true, message: 'At least one lorry receipt is required' };
    }
    if (formData.toPay && isNaN(formData.toPay)) {
      errors.toPay = { invalid: true, message: 'Total to pay should be a number' };
    }
    if (formData.billed && isNaN(formData.billed)) {
      errors.billed = { invalid: true, message: 'Total billed should be a number' };
    }
    if (formData.hire && isNaN(formData.hire)) {
      errors.hire = { invalid: true, message: 'Hire should be a number' };
    }
    if (formData.advance && isNaN(formData.advance)) {
      errors.advance = { invalid: true, message: 'Advance should be a number' };
    }
    if (formData.commission && isNaN(formData.commission)) {
      errors.commission = { invalid: true, message: 'Commission should be a number' };
    }
    if (formData.hamali && isNaN(formData.hamali)) {
      errors.hamali = { invalid: true, message: 'Hamali should be a number' };
    }
    if (formData.stacking && isNaN(formData.stacking)) {
      errors.stacking = { invalid: true, message: 'Stacking should be a number' };
    }
    if (formData.total && isNaN(formData.total)) {
      errors.total = { invalid: true, message: 'Total should be a number' };
    }
    if (!formData.ackBranch) {
      errors.ackBranch = { invalid: true, message: 'Ack branch is required' };
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
    setLoadingSlip(currState => {
      return {
        ...currState,
        [name]: new Date(date)
      };
    });
  };

  useEffect(() => {
    const total = (+loadingSlip.toPay + +loadingSlip.billed + +loadingSlip.hire + +loadingSlip.commission + +loadingSlip.hamali + +loadingSlip.stacking) - +loadingSlip.advance;
    setLoadingSlip(currState => {
      return {
        ...currState,
        total: total
      }
    });
  }, [
    loadingSlip.toPay,
    loadingSlip.billed,
    loadingSlip.hire,
    loadingSlip.advance,
    loadingSlip.commission,
    loadingSlip.hamali,
    loadingSlip.stacking
  ]);

  const handleSelectedLr = (lr) => {
    setUpdatedLRList(lr);
  };

  useEffect(() => {
    let toPay = 0;
    updatedLrList.forEach(lr => {
      toPay += lr.total
    });
    setLoadingSlip(currState => {
      return {
        ...currState,
        toPay: toPay
      }
    });
  }, [updatedLrList]);

  const autocompleteChangeListener = (e, option, name) => {
    setLoadingSlip(currState => {
      return {
        ...currState,
        [name]: option
      };
    });
    if (name === 'vehicle') {
      const selectedVehicle = vehicles.filter(vehicle => vehicle._id === option._id)[0];
      const selectedSupplier = suppliers.filter(supplier => supplier._id === selectedVehicle.owner)[0];
      setLoadingSlip(currState => {
        return {
          ...currState,
          vehicleNo: selectedVehicle.vehicleNo,
          vehicleOwner: selectedSupplier.name,
          vehicleOwnerAddress: `${selectedSupplier.address}, ${selectedSupplier.city}`
        };
      });
    }

    if (name === 'driver') {
      const driver = drivers.filter(driver => driver._id === option._id)[0];
      setLoadingSlip(currState => {
        return {
          ...currState,
          driverName: driver.name,
          licenseNo: driver.licenseNo,
          mobile: driver.phone
        };
      });
    }
  };

  return <>
    {isLoading && <LoadingSpinner />}
    <h1 className='pageHead'>{isLocalMemo ? 'Update a local memo loading slip' : 'Update a loading slip'}</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}
    <form action='' onSubmit={submitHandler} id='loadingSlipForm'>
      <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.branch.invalid}>
              <InputLabel id='branch'>Branch</InputLabel>
              <Select
                labelId='branch'
                name='branch'
                label='Branch'
                value={loadingSlip.branch}
                onChange={inputChangeHandler}
              >
                {branches.length > 0 && branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
              </Select>
              {formErrors.branch.invalid && <FormHelperText>{formErrors.branch.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.date.invalid}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  error={formErrors.date.invalid}
                  label='Date'
                  inputFormat='DD/MM/YYYY'
                  value={loadingSlip.date}
                  disableFuture={true}
                  onChange={dateInputChangeHandler.bind(null, 'date')}
                  inputProps={{
                    readOnly: true
                  }}
                  renderInput={(params) => <TextField name='date' size='small' {...params} error={formErrors.date.invalid} />}
                />
              </LocalizationProvider>
              {formErrors.date.invalid && <FormHelperText>{formErrors.date.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.vehicle.invalid}>
              <Autocomplete
                disablePortal
                autoSelect
                size='small'
                name="vehicle"
                options={vehicles}
                value={loadingSlip.vehicle}
                onChange={(e, value) => autocompleteChangeListener(e, value, 'vehicle')}
                openOnFocus
                renderInput={(params) => <TextField {...params} label="Vehicle" error={formErrors.vehicle.invalid} fullWidth />}
              />
              {formErrors.vehicle.invalid && <FormHelperText>{formErrors.vehicle.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.vehicleOwner.invalid}>
              <TextField size='small' variant='outlined' label='Vehicle owner' error={formErrors.vehicleOwner.invalid} value={loadingSlip.vehicleOwner} onChange={inputChangeHandler} name='vehicleOwner' id='vehicleOwner' inputProps={{ readOnly: true }} />
              {formErrors.vehicleOwner.invalid && <FormHelperText>{formErrors.vehicleOwner.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.vehicleOwnerAddress.invalid}>
              <TextField size='small' variant='outlined' label='Vehicle owner address' error={formErrors.vehicleOwnerAddress.invalid} value={loadingSlip.vehicleOwnerAddress} onChange={inputChangeHandler} name='vehicleOwnerAddress' id='vehicleOwnerAddress' inputProps={{ readOnly: true }} />
              {formErrors.vehicleOwnerAddress.invalid && <FormHelperText>{formErrors.vehicleOwnerAddress.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'></div>
          <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.driver.invalid}>
              <Autocomplete
                disablePortal
                autoSelect
                size='small'
                name="driver"
                options={drivers}
                value={loadingSlip.driver}
                onChange={(e, value) => autocompleteChangeListener(e, value, 'driver')}
                openOnFocus
                renderInput={(params) => <TextField {...params} label="Driver" error={formErrors.driver.invalid} fullWidth />}
              />
              {formErrors.driver.invalid && <FormHelperText>{formErrors.driver.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.licenseNo.invalid}>
              <TextField size='small' variant='outlined' label='License no' value={loadingSlip.licenseNo} error={formErrors.licenseNo.invalid} onChange={inputChangeHandler} name='licenseNo' id='licenseNo' inputProps={{ readOnly: true }} />
              {formErrors.licenseNo.invalid && <FormHelperText>{formErrors.licenseNo.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.mobile.invalid}>
              <TextField size='small' variant='outlined' label='Mobile' value={loadingSlip.mobile} error={formErrors.mobile.invalid} onChange={inputChangeHandler} name='mobile' id='mobile' inputProps={{ readOnly: true }} />
              {formErrors.mobile.invalid && <FormHelperText>{formErrors.mobile.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.from.invalid}>
              {/* <InputLabel id='from'>From</InputLabel>
              <Select
                labelId='from'
                name='from'
                label='From'
                value={loadingSlip.from}
                onChange={inputChangeHandler}
              >
                {places.length > 0 && places.map(place => <MenuItem key={place._id} value={place._id} className='menuItem'>{place.name}</MenuItem>)}
              </Select> */}
              <Autocomplete
                disablePortal
                autoSelect
                size='small'
                name="from"
                options={places}
                value={loadingSlip.from}
                onChange={(e, value) => autocompleteChangeListener(e, value, 'from')}
                openOnFocus
                renderInput={(params) => <TextField {...params} label="From" error={formErrors.from.invalid} fullWidth />}
              />
              {formErrors.from.invalid && <FormHelperText>{formErrors.from.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.to.invalid}>
              {/* <InputLabel id='to'>To</InputLabel>
              <Select
                labelId='to'
                name='to'
                label='To'
                value={loadingSlip.to}
                onChange={inputChangeHandler}
              >
                {places.length > 0 && places.map(place => <MenuItem key={place._id} value={place._id} className='menuItem'>{place.name}</MenuItem>)}
              </Select> */}
              <Autocomplete
                disablePortal
                autoSelect
                size='small'
                name="to"
                options={places}
                value={loadingSlip.to}
                onChange={(e, value) => autocompleteChangeListener(e, value, 'to')}
                openOnFocus
                renderInput={(params) => <TextField {...params} label="To" error={formErrors.to.invalid} fullWidth />}
              />
              {formErrors.to.invalid && <FormHelperText>{formErrors.to.message}</FormHelperText>}
            </FormControl>
          </div>
        </div>
      </Paper>
    </form>
    <h2 className='mb20'>Freight details</h2>
    {formErrors.lrList.invalid && <p className='error'>{formErrors.lrList.message}</p>}
    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <FreightDetailsEdit loadingSlip={loadingSlip} setLoadingSlip={setLoadingSlip} customers={customers} lorryReceipts={lsLrList} setLorryReceipts={setLsLrList} handleSelectedLr={handleSelectedLr} />
      <Divider sx={{ margin: '20px 0' }} />
      <form action='' onSubmit={submitHandler} id='loadingSlipForm'>
        <h3 className='mb20'>Charges</h3>
        <div className='grid grid-8-col'>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.toPay.invalid}>
              <TextField size='small' type='number' variant='outlined' label='Total to pay' value={loadingSlip.toPay} error={formErrors.toPay.invalid} onChange={inputChangeHandler} name='toPay' id='toPay' inputProps={{ readOnly: true, inputMode: 'numeric', pattern: '[0-9]*' }} />
              {formErrors.toPay.invalid && <FormHelperText>{formErrors.toPay.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.billed.invalid}>
              <TextField size='small' type='number' variant='outlined' label='Total billed' value={loadingSlip.billed} error={formErrors.billed.invalid} onChange={inputChangeHandler} name='billed' id='billed' />
              {formErrors.billed.invalid && <FormHelperText>{formErrors.billed.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.hire.invalid}>
              <TextField size='small' type='number' variant='outlined' label='Hire' value={loadingSlip.hire} error={formErrors.hire.invalid} onChange={inputChangeHandler} name='hire' id='hire' />
              {formErrors.hire.invalid && <FormHelperText>{formErrors.hire.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.advance.invalid}>
              <TextField size='small' type='number' variant='outlined' label='Advance (deduct)' value={loadingSlip.advance} onChange={inputChangeHandler} name='advance' id='advance' />
              {formErrors.advance.invalid && <FormHelperText>{formErrors.advance.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.commission.invalid}>
              <TextField size='small' type='number' variant='outlined' label='Commission' value={loadingSlip.commission} onChange={inputChangeHandler} name='commission' id='commission' />
              {formErrors.commission.invalid && <FormHelperText>{formErrors.commission.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.hamali.invalid}>
              <TextField size='small' type='number' variant='outlined' label='Hamali' value={loadingSlip.hamali} onChange={inputChangeHandler} name='hamali' id='hamali' />
              {formErrors.hamali.invalid && <FormHelperText>{formErrors.hamali.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.stacking.invalid}>
              <TextField size='small' type='number' variant='outlined' label='Stacking' value={loadingSlip.stacking} onChange={inputChangeHandler} name='stacking' id='stacking' />
              {formErrors.stacking.invalid && <FormHelperText>{formErrors.stacking.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.total.invalid}>
              <TextField size='small' type='number' variant='outlined' label='Total' value={loadingSlip.total} onChange={inputChangeHandler} name='total' id='total' inputProps={{ readOnly: true, inputMode: 'numeric', pattern: '[0-9]*' }} />
              {formErrors.total.invalid && <FormHelperText>{formErrors.total.message}</FormHelperText>}
            </FormControl>
          </div>
        </div>
      </form>
    </Paper>

    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <form action='' onSubmit={submitHandler} id='loadingSlipForm'>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.ackBranch.invalid}>
              {/* <InputLabel id='ackBranch'>Ack branch</InputLabel>
              <Select
                labelId='ackBranch'
                name='ackBranch'
                label='Ack branch'
                value={loadingSlip.ackBranch}
                onChange={inputChangeHandler}
              >
                {branches.length > 0 && branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
              </Select> */}
              <Autocomplete
                disablePortal
                autoSelect
                size='small'
                name="ackBranch"
                options={branches}
                value={loadingSlip.ackBranch}
                onChange={(e, value) => autocompleteChangeListener(e, value, 'ackBranch')}
                openOnFocus
                renderInput={(params) => <TextField {...params} label="Ack branch" error={formErrors.ackBranch.invalid} fullWidth />}
              />
              {formErrors.ackBranch.invalid && <FormHelperText>{formErrors.ackBranch.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Remark' value={loadingSlip.remark} onChange={inputChangeHandler} name='remark' id='remark' />
            </FormControl>
          </div>
        </div>
      </form>
      <div className='right'>
        <Button variant='outlined' size='medium' onClick={backButtonHandler}>Back</Button>
        <Button variant='outlined' size='medium' onClick={resetButtonHandler} className='ml6'>Reset</Button>
        <Button variant='contained' size='medium' type='submit' color='primary' form='loadingSlipForm' className='ml6'>Save</Button>
      </div>
    </Paper>
  </>;
};

export default LoadingSlipEdit;