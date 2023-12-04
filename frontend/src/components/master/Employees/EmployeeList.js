import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Alert, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { getEmployees, removeEmployee } from '../../../lib/api-master';
import { getFormattedDate } from '../../../lib/helper';
import { checkAuth } from '../../../lib/RequireAuth';

import Dialog from '../../UI/Dialog';
import LoadingSpinner from '../../UI/LoadingSpinner';

const EmployeeList = () => {

  const columns = [
    { field: '_id', headerName: 'Id' },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'designation', headerName: 'Designation', flex: 1 },
    { field: 'email', headerName: 'Email Id', flex: 1 },
    {
      field: 'joiningDate', headerName: 'Joining date', flex: 1, renderCell: (params) => {
        const formattedDate = getFormattedDate(new Date(params.row.joiningDate));
        return formattedDate;
      }
    },
    { field: 'mobile', headerName: 'Mobile no', flex: 1 },
    {
      field: 'actions', headerName: '', flex: 1, sortable: false, renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          return navigateToEdit(params.row._id);
        };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteBranch(params.row._id);
        }

        return <>
          <IconButton size='small' onClick={onClick} color='primary'><EditIcon /></IconButton>&nbsp;&nbsp;
          <IconButton size='small' onClick={triggerDelete} color='error'><DeleteIcon /></IconButton>
        </>;
      }
    }
  ];

  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [httpError, setHttpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState('');
  const [isUnauth, setIsUnauth] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
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
      .catch(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
      setIsLoading(false);
      setHttpError('');
      setEmployees([]);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    if (deleteEmployeeId) {
      setIsLoading(true);
      removeEmployee(deleteEmployeeId, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            const updatedEmployees = employees.filter(branch => branch._id !== response.id);
            setEmployees(updatedEmployees);
          }
          setIsLoading(false);
          setDeleteEmployeeId('');
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError(error.message);
        });
    };

    return () => {
      controller.abort();
    };
  }, [deleteEmployeeId, employees]);


  const handleAddEmployee = () => {
    navigate('/master/employees/addEmployee');
  };

  const navigateToEdit = (id) => {
    navigate('/master/employees/editEmployee', { state: { employeeId: id } });
  };

  const deleteBranch = (id) => {
    if (checkAuth('master', 'employees', 'write')) {
      setSelectedId(id);
      setIsDialogOpen(true);
    } else {
      setIsUnauth(true);
    }
  };

  const handleDialogClose = (e) => {
    if (e.target.value === 'true') {
      setDeleteEmployeeId(selectedId);
    } else {
      setSelectedId('');
    }
    setIsDialogOpen(false);
  };

  const handleUnauthClose = () => {
    setIsUnauth(false);
  }

  return <>
    {isLoading && <LoadingSpinner />}

    {isDialogOpen && <Dialog isOpen={true} onClose={handleDialogClose} title='Are you sure?' content='Do you want to delete the employee?' warning />}
    <Snackbar open={isUnauth} autoHideDuration={6000} onClose={handleUnauthClose} message='You are not authorized to perform delete' />

    <div className='page_head'>
      <h1 className='pageHead'>Employee list</h1>
      <div className='page_actions'>
        <Button variant='contained' size='small' type='button' color='primary' className='ml6' onClick={handleAddEmployee}>Add a employee</Button>
      </div>
    </div>

    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}

    {<div style={{ width: '100%' }}>
      <DataGrid
        sx={{ backgroundColor: 'primary.contrastText' }}
        autoHeight
        density='compact'
        getRowId={(row) => row._id}
        rows={employees}
        columns={columns}
        initialState={{
          ...columns,
          columns: {
            columnVisibilityModel: {
              _id: false
            },
          },
        }}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
      />
    </div>}

  </>;
};

export default EmployeeList;