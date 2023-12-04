import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


const LRAcknowledgementView = ({ selectedLR, setSelectedLR, isViewOpen, setIsViewOpen }) => {

  const user = useSelector(state => state.user);

  const close = useCallback(() => {
    setSelectedLR(null);
    setIsViewOpen(false);
  }, [setIsViewOpen, setSelectedLR]);

  return <>
    {isViewOpen && <Dialog open={isViewOpen} onClose={close} scroll='paper' fullWidth maxWidth='lg'>

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
            <tr>
              <td colSpan={4}>
                <div className="ack_display_image" style={{ backgroundImage: `url(${selectedLR.ack})` }}></div>
              </td>
            </tr>
          </tbody>
        </table>
      </DialogContent>
      <DialogActions sx={{ paddingRight: '24px', paddingLeft: '24px', justifyContent: 'right' }}>
        <Button type='button' variant='outlined' size='medium' onClick={close}>Close</Button>
      </DialogActions>
    </Dialog>}
  </>;
};

export default LRAcknowledgementView;