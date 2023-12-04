import { Alert, Stack, InputLabel, MenuItem, FormControl, Button, Paper, Divider, TextField, InputAdornment } from '@mui/material';
import Select from '@mui/material/Select';
import { useState } from 'react';
import AddSupplierBill from './AddSupplierBill';
import SupplierBillList from './SupplierBillList';

const SupplierBills = ({ suppliers, selectedSupplier }) => {

  const [triggerFetch, setTriggerFetch] = useState(true);

  return <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
    {selectedSupplier ? <>
      <>
        <AddSupplierBill selectedSupplier={selectedSupplier} setTriggerFetch={setTriggerFetch} />
        <Divider sx={{ margin: '20px 0' }} />
      </>
    </> : null}
    <SupplierBillList selectedSupplier={selectedSupplier} triggerFetch={triggerFetch} setTriggerFetch={setTriggerFetch} />
  </Paper>;
};

export default SupplierBills;