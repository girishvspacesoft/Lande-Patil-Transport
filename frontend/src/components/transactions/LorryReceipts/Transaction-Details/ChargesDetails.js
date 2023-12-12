import { useEffect, useState } from "react";
import { TextField, FormControl, FormHelperText } from "@mui/material";

const initialState = {
  invoiceNo: "",
  article: "",
  company: "",
  place: "",
  articleNum: "",
  weight: "",
  remark: "",
  payment: "",
};

const initialErrorState = {
  invoiceNo: {
    invalid: false,
    message: "",
  },
  company: {
    invalid: false,
    message: "",
  },
  place: {
    invalid: false,
    message: "",
  },
  article: {
    invalid: false,
    message: "",
  },
  articleNum: {
    invalid: false,
    message: "",
  },
  weight: {
    invalid: false,
    message: "",
  },
  payment: {
    invalid: false,
    message: "",
  },
};

const ChargesDetails = ({ lorryReceipt, setLorryReceipt, formErrors }) => {
  

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLorryReceipt((currState) => {
      return {
        ...currState,
        chargesDetails: {
          ...currState.chargesDetails,
          [name]: Number(value),          
        }
      };
    });
  };
  
  return (
    <div> 
      <form       
        className="mb20"
      >
        <div className="grid grid-7-col">
          <div className="grid-item">
            <FormControl fullWidth error={formErrors.chargesDetails.hamali.invalid}>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Hamali"
                value={lorryReceipt.chargesDetails.hamali}
                error={formErrors.chargesDetails.hamali.invalid}
                onChange={inputChangeHandler}
                name="hamali"
                id="hamali"
              />
              {formErrors.chargesDetails.hamali.invalid && (
                <FormHelperText>{formErrors.chargesDetails.hamali.message}</FormHelperText>
              )}
            </FormControl>
          </div>

          <div className="grid-item">
            <FormControl fullWidth error={formErrors.chargesDetails.octroi.invalid}>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Octroi"
                value={lorryReceipt.chargesDetails.octroi}
                error={formErrors.chargesDetails.octroi.invalid}
                onChange={inputChangeHandler}
                name="octroi"
                id="octroi"
              />
              {formErrors.chargesDetails.octroi.invalid && (
                <FormHelperText>{formErrors.chargesDetails.octroi.message}</FormHelperText>
              )}
            </FormControl>
          </div>

          <div className="grid-item">
            <FormControl fullWidth error={formErrors.chargesDetails.weight.invalid}>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Weight"
                value={lorryReceipt.chargesDetails.weight}
                error={formErrors.chargesDetails.weight.invalid}
                onChange={inputChangeHandler}
                name="weight"
                id="weight"
              />
              {formErrors.chargesDetails.weight.invalid && (
                <FormHelperText>{formErrors.chargesDetails.weight.message}</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="grid-item">
            <FormControl fullWidth error={formErrors.chargesDetails.toll.invalid}>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Toll ch"
                value={lorryReceipt.chargesDetails.toll}
                error={formErrors.chargesDetails.toll.invalid}
                onChange={inputChangeHandler}
                name="toll"
                id="toll"
              />
              {formErrors.chargesDetails.toll.invalid && (
                <FormHelperText>{formErrors.chargesDetails.toll.message}</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="grid-item">
            <FormControl fullWidth error={formErrors.chargesDetails.escort.invalid}>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Escort"
                value={lorryReceipt.chargesDetails.escort}
                error={formErrors.chargesDetails.escort.invalid}
                onChange={inputChangeHandler}
                name="escort"
                id="escort"
              />
              {formErrors.chargesDetails.escort.invalid && (
                <FormHelperText>{formErrors.chargesDetails.escort.message}</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="grid-item">
            <FormControl fullWidth error={formErrors.chargesDetails.other.invalid}>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                label="Other"
                value={lorryReceipt.chargesDetails.other}
                error={formErrors.chargesDetails.other.invalid}
                onChange={inputChangeHandler}
                name="other"
                id="other"
              />
              {formErrors.chargesDetails.other.invalid && (
                <FormHelperText>{formErrors.chargesDetails.other.message}</FormHelperText>
              )}
            </FormControl>
          </div>
          
          <div className="grid-item">
            <h4 style={{marginTop: '7px'}}>G. Total: {lorryReceipt.chargesDetails.hamali + lorryReceipt.chargesDetails.octroi + lorryReceipt.chargesDetails.weight + lorryReceipt.chargesDetails.toll + lorryReceipt.chargesDetails.escort + lorryReceipt.chargesDetails.other}</h4>
          </div>
        </div>
        
      </form>
    </div>
  );
};

export default ChargesDetails;
