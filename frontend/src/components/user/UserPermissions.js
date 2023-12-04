import { useEffect, useState, useCallback } from 'react';
import { InputLabel, MenuItem, FormControl, Button, Divider, Switch, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Select from '@mui/material/Select';
import { Alert, Stack } from '@mui/material';

import { getUser, getUsersByBranch, updateUserPermissions } from '../../lib/api-user';
import { getBranches, getEmployees } from '../../lib/api-master';

import classes from './UserPermissions.module.css';
import LoadingSpinner from '../UI/LoadingSpinner';

const UserPermissions = () => {

  const [branchUsers, setBranchUsers] = useState([]);
  const [httpError, setHttpError] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [fetchedUser, setFetchedUser] = useState({});
  const [permissions, setPermissions] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

  const goToUsersList = useCallback(() => {
    navigate('/users/usersList');
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(false);
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
        setHttpError('Something went wrong! Please try later or contact Administrator.');
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(false);
    getEmployees(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setEmployees(response);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setHttpError('Something went wrong! Please try later or contact Administrator.');
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (selectedBranch) {
      getUsersByBranch(selectedBranch, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            if (employees.length) {
              const users = response;
              const updatedUsers = users.map(user => {
                const employee = employees.filter(employee => employee._id === user.employee);
                if (employee.length) {
                  user.employee = {
                    name: employee[0].name,
                    id: employee[0]._id
                  };
                }
                return user;
              });
              setBranchUsers(updatedUsers);
            }
          }
        })
        .catch(error => {
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };
    return () => {
      controller.abort();
    };
  }, [selectedBranch, employees]);

  useEffect(() => {
    const controller = new AbortController();
    if (selectedUser) {
      getUser(selectedUser, controller)
        .then(response => {
          setFetchedUser(response);
          setPermissions(response.permissions);
        })
        .catch(error => {
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    } else {
      setFetchedUser({});
    };

    return () => {
      controller.abort();
    };
  }, [selectedUser]);

  useEffect(() => {
    const controller = new AbortController();
    if (isSubmitted) {
      const user = {
        id: selectedUser,
        permissions: permissions
      }

      updateUserPermissions(user, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            goToUsersList();
          }
        })
        .catch(error => {
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [isSubmitted, selectedUser, permissions, goToUsersList]);

  const branchChangeHandler = (e) => {
    setSelectedBranch(e.target.value);
  };

  const userChangeHandler = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleSwitchChange = (e, checked) => {
    const name = e.target.name;
    const mainSection = name.split('_')[0];
    const subSection = name.split('_')[1];
    const type = name.split('_')[2];
    setPermissions(currPermissions => {
      const updatedPermissions = { ...currPermissions };
      updatedPermissions[mainSection][subSection][type] = checked;
      return updatedPermissions;
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const cancelButtonHandler = () => {
    goToUsersList();
  }

  return (
    <>
      {isLoading && <LoadingSpinner />}

      <h1 className='pageHead'>User permissions</h1>

      {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
        <Alert severity='error'>{httpError}</Alert>
      </Stack>}

      <form action='' onSubmit={submitHandler}>
        <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
          <div className='grid grid-6-col'>
            <div className='grid-item'>
              {branches && branches.length > 0 && <FormControl fullWidth size='small'>
                <InputLabel id='branch'>Branch</InputLabel>
                <Select
                  labelId='branch'
                  name='branch'
                  value={selectedBranch}
                  label='Branch'
                  onChange={branchChangeHandler}
                >
                  {branches.map(branch => <MenuItem value={branch._id} key={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
                </Select>
              </FormControl>}
            </div>
            <div className='grid-item'>
              {branches && branches.length > 0 && <FormControl fullWidth size='small'>
                <InputLabel id='users'>Users</InputLabel>
                <Select
                  labelId='users'
                  name='users'
                  value={selectedUser}
                  label='Users'
                  onChange={userChangeHandler}
                >
                  <MenuItem value='' className='menuItem'>Select</MenuItem>
                  {branchUsers && branchUsers.length && branchUsers.map(user => <MenuItem value={user.id} key={user.id} className='menuItem'>{user.employee.name}</MenuItem>)}
                </Select>
              </FormControl>}
            </div>
          </div>
        </Paper>
        {fetchedUser.employee && (<><Divider sx={{ marginBottom: '20px' }} />
          <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
            <table className={classes.tbl_permissions}>
              <tbody>
                <tr>
                  <th></th>
                  <th>View</th>
                  <th>Edit</th>
                  <th></th>
                  <th>View</th>
                  <th>Edit</th>
                </tr>
                <tr><td colSpan={3} className={classes.head}>Master</td></tr>
                <tr>
                  <td>Article</td>
                  <td><Switch name='master_articles_read' checked={permissions.master.articles.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='master_articles_write' checked={permissions.master.articles.write} onChange={handleSwitchChange} /></td>
                  <td>Places</td>
                  <td><Switch name='master_places_read' checked={permissions.master.places.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='master_places_write' checked={permissions.master.places.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr>
                  <td>Branches</td>
                  <td><Switch name='master_branches_read' checked={permissions.master.branches.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='master_branches_write' checked={permissions.master.branches.write} onChange={handleSwitchChange} /></td>
                  <td>Customer</td>
                  <td><Switch name='master_customers_read' checked={permissions.master.customers.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='master_customers_write' checked={permissions.master.customers.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr>
                  <td>Employee</td>
                  <td><Switch name='master_employees_read' checked={permissions.master.employees.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='master_employees_write' checked={permissions.master.employees.write} onChange={handleSwitchChange} /></td>
                  <td>Driver</td>
                  <td><Switch name='master_drivers_read' checked={permissions.master.drivers.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='master_drivers_write' checked={permissions.master.drivers.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr>
                  <td>Vehicle</td>
                  <td><Switch name='master_vehicles_read' checked={permissions.master.vehicles.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='master_vehicles_write' checked={permissions.master.vehicles.write} onChange={handleSwitchChange} /></td>
                  <td>Vehicle Types</td>
                  <td><Switch name='master_vehicleTypes_read' checked={permissions.master.vehicleTypes.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='master_vehicleTypes_write' checked={permissions.master.vehicleTypes.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr>
                  <td>Vehicle Owner</td>
                  <td><Switch name='master_vehicleOwners_read' checked={permissions.master.vehicleOwners.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='master_vehicleOwners_write' checked={permissions.master.vehicleOwners.write} onChange={handleSwitchChange} /></td>
                  <td>Suppliers</td>
                  <td><Switch name='master_suppliers_read' checked={permissions.master.suppliers.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='master_suppliers_write' checked={permissions.master.suppliers.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr>
                  <td>Banks</td>
                  <td><Switch name='master_banks_read' checked={permissions.master.banks.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='master_banks_write' checked={permissions.master.banks.write} onChange={handleSwitchChange} /></td>
                  <td>Bank Accounts</td>
                  <td><Switch name='master_bankAccounts_read' checked={permissions.master.bankAccounts.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='master_bankAccounts_write' checked={permissions.master.bankAccounts.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr><td colSpan={6} className={classes.head}>Transactions</td></tr>
                <tr>
                  <td>LR</td>
                  <td><Switch name='transactions_lr_read' checked={permissions.transactions.lr.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='transactions_lr_write' checked={permissions.transactions.lr.write} onChange={handleSwitchChange} /></td>
                  <td>DC</td>
                  <td><Switch name='transactions_dc_read' checked={permissions.transactions.dc.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='transactions_dc_write' checked={permissions.transactions.dc.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr>
                  <td>FM</td>
                  <td><Switch name='transactions_fm_read' checked={permissions.transactions.fm.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='transactions_fm_write' checked={permissions.transactions.fm.write} onChange={handleSwitchChange} /></td>
                  <td>IR</td>
                  <td><Switch name='transactions_ir_read' checked={permissions.transactions.ir.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='transactions_ir_write' checked={permissions.transactions.ir.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr>
                  <td>POD</td>
                  <td><Switch name='transactions_pod_read' checked={permissions.transactions.pod.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='transactions_pod_write' checked={permissions.transactions.pod.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr><td colSpan={6} className={classes.head}>Bills</td></tr>
                <tr>
                  <td>Regular</td>
                  <td><Switch name='bills_regular_read' checked={permissions.bills.regular.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='bills_regular_write' checked={permissions.bills.regular.write} onChange={handleSwitchChange} /></td>
                  <td>Transporter</td>
                  <td><Switch name='bills_transporter_read' checked={permissions.bills.transporter.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='bills_transporter_write' checked={permissions.bills.transporter.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr><td colSpan={6} className={classes.head}>Reports</td></tr>
                <tr>
                  <td>MIS</td>
                  <td><Switch name='reports_mis_read' checked={permissions.reports.mis.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='reports_mis_write' checked={permissions.reports.mis.write} onChange={handleSwitchChange} /></td>
                  <td>Stock</td>
                  <td><Switch name='reports_stock_read' checked={permissions.reports.stock.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='reports_stock_write' checked={permissions.reports.stock.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr>
                  <td>LR By Date</td>
                  <td><Switch name='reports_lrByDate_read' checked={permissions.reports.lrByDate.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='reports_lrByDate_write' checked={permissions.reports.lrByDate.write} onChange={handleSwitchChange} /></td>
                  <td>LR By Branch</td>
                  <td><Switch name='reports_lrByBranch_read' checked={permissions.reports.lrByBranch.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='reports_lrByBranch_write' checked={permissions.reports.lrByBranch.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr>
                  <td>LR By Customer</td>
                  <td><Switch name='reports_lrByCustomer_read' checked={permissions.reports.lrByCustomer.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='reports_lrByCustomer_write' checked={permissions.reports.lrByCustomer.write} onChange={handleSwitchChange} /></td>
                  <td>DC By Date</td>
                  <td><Switch name='reports_dcByDate_read' checked={permissions.reports.dcByDate.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='reports_dcByDate_write' checked={permissions.reports.dcByDate.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr>
                  <td>DC By Branch</td>
                  <td><Switch name='reports_dcByBranch_read' checked={permissions.reports.dcByBranch.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='reports_dcByBranch_write' checked={permissions.reports.dcByBranch.write} onChange={handleSwitchChange} /></td>
                  <td>DC By Vehicle</td>
                  <td><Switch name='reports_dcByVehicle_read' checked={permissions.reports.dcByVehicle.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='reports_dcByVehicle_write' checked={permissions.reports.dcByVehicle.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr>
                  <td>Collection FM</td>
                  <td><Switch name='reports_collectionFm_read' checked={permissions.reports.collectionFm.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='reports_collectionFm_write' checked={permissions.reports.collectionFm.write} onChange={handleSwitchChange} /></td>
                  <td>LINE FM</td>
                  <td><Switch name='reports_lineFm_read' checked={permissions.reports.lineFm.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='reports_lineFm_write' checked={permissions.reports.lineFm.write} onChange={handleSwitchChange} /></td>
                </tr>
                <tr>
                  <td>Customer End FM</td>
                  <td><Switch name='reports_customerEndFm_read' checked={permissions.reports.customerEndFm.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='reports_customerEndFm_write' checked={permissions.reports.customerEndFm.write} onChange={handleSwitchChange} /></td>
                  <td>Transporter Bill Report</td>
                  <td><Switch name='reports_transporterBillReport_read' checked={permissions.reports.transporterBillReport.read} onChange={handleSwitchChange} /></td>
                  <td><Switch name='reports_transporterBillReport_write' checked={permissions.reports.transporterBillReport.write} onChange={handleSwitchChange} /></td>
                </tr>
              </tbody>
            </table>

            <div className='right'>
              <Button variant='outlined' size='medium' onClick={cancelButtonHandler}>Cancel</Button>
              <Button variant='contained' size='medium' type='submit' color='primary' className='ml6'>Save</Button>
            </div>
          </Paper></>
        )}
      </form>
    </>
  );
};

export default UserPermissions;