import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, FormControl, FormHelperText } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingSpinner from '../../UI/LoadingSpinner';
import { updateLorryReceiptAck } from '../../../lib/api-transactions';


const LRAcknowledgementUpload = ({ selectedLR, setSelectedLR, isOpen, setIsOpen, setGetLR }) => {

  const initialErrorState = useMemo(() => {
    return {
      ack: {
        invalid: false,
        message: ''
      }
    };
  }, [])

  const user = useSelector(state => state.user);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSelectedAck, setShowSelectedAck] = useState(false);

  const close = useCallback(() => {
    setSelectedLR(null);
    setIsOpen(false);
    setIsSubmitted(false);
    setHasErrors(false);
    setFormErrors(initialErrorState);
    setIsLoading(false);
    setHttpError('');
  }, [setIsOpen, setSelectedLR, initialErrorState]);

  useEffect(() => {
    const controller = new AbortController();
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      updateLorryReceiptAck(selectedLR, controller)
        .then(response => {
          
          if (response.message) {
            setHttpError(response.message);
          } else {
            setGetLR(true);
            close();
          }
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError(error.message);
        });
    }
    return () => {
      controller.abort();
    };
  }, [isSubmitted, hasErrors, selectedLR, close]);

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };

    if (!selectedLR.ack) {
      errors.ack = { invalid: true, message: 'File is required' };
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
    setFormErrors(currState => validateForm(selectedLR));
    setIsSubmitted(true);
  };

  const ackChangeHandler = (e) => {
    const name = e.target.name;
    const file = e.target.files[0];
    setSelectedLR(currState => {
      return {
        ...currState,
        [name]: file
      };
    });
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const uploaded_image = reader.result;
      document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(file);
    if (file) {
      setShowSelectedAck(true);
    }
  };

  const removeIcon = () => {
    setSelectedLR(state => {
      return {
        ...state,
        ack: null
      };
    });
    if (document.querySelector("#display-image")) {
      document.querySelector("#display-image").style.backgroundImage = null;
    }
    setShowSelectedAck(false);
  };

  return <>
    {isLoading && <LoadingSpinner />}
    {isOpen && <Dialog open={isOpen} onClose={close} scroll='paper' fullWidth maxWidth='lg'>
      <form onSubmit={submitHandler}>
        <DialogTitle>Lorry receipt No. {selectedLR.wayBillNo}</DialogTitle>
        <DialogContent dividers={true}>
          <table className='tbl_lr'>
            <tbody>
              <tr>
                <td>Date</td>
                <td>{selectedLR.formattedDate}</td>
                <td>Vehicle</td>
                <td>{selectedLR.vehicleNo}</td>
              </tr>
              <tr>
                <td>Consignor</td>
                <td>{selectedLR.consignorName}</td>
                <td>Consignee</td>
                <td>{selectedLR.consigneeName}</td>
              </tr>
              <tr>
                <td>From</td>
                <td>{selectedLR.from}</td>
                <td>To</td>
                <td>{selectedLR.to}</td>
              </tr>
              {!selectedLR.ack ? <tr>
                <td>Upload</td>
                <td colSpan={3}>
                  <FormControl error={formErrors.ack.invalid}>
                    <Button variant="contained" component="label">
                      Upload acknowledgement
                      <input
                        type='file'
                        name='ack'
                        hidden
                        accept='image/*'
                        onChange={ackChangeHandler}
                      />
                    </Button>
                    {formErrors.ack.invalid && <FormHelperText>{formErrors.ack.message}</FormHelperText>}
                  </FormControl>
                </td>
              </tr> : null}
              <tr>
                <td colSpan={4}>
                  {showSelectedAck &&
                    <div id='display-image' className="ack_display_image">
                      <Button variant='contained' color='error' onClick={removeIcon}>Remove</Button>
                    </div>}
                </td>
              </tr>
            </tbody>
          </table>
        </DialogContent>
        <DialogActions sx={{ paddingRight: '24px', paddingLeft: '24px', justifyContent: 'right' }}>
          <Button type='button' variant='outlined' size='medium' onClick={close}>Close</Button>
          <Button type='submit' variant='contained' size='medium' disabled={!selectedLR.ack}>Save</Button>
        </DialogActions>
      </form>
    </Dialog>}
  </>;
};

export default LRAcknowledgementUpload;