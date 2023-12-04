import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Alert, Stack } from '@mui/material';
import { TextField, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

import LoadingSpinner from '../UI/LoadingSpinner';
import Dialog from '../UI/Dialog';

import { getUsers, removeUser, searchUser } from '../../lib/api-user';
import { getBranches, getEmployees } from '../../lib/api-master';

const UserList = () => {
  const columns = [
    { field: '_id', headerName: 'Id' },
    { field: 'branch', headerName: 'Employee branch', flex: 1 },
    { field: 'employee', headerName: 'Employee name', flex: 1 },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'type', headerName: 'User type', flex: 1 },
    {
      field: 'actions', headerName: '', flex: 1, sortable: false, renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          return navigateToEdit(params.row.id);
        };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteUser(params.row.id);
        }

        return <>
          <IconButton size='small' onClick={onClick} color='primary'><EditIcon /></IconButton>&nbsp;&nbsp;
          <IconButton size='small' onClick={triggerDelete} color='error'><DeleteIcon /></IconButton>
        </>;
      }
    }
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState('');
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [branches, setBranches] = useState([]);
  const [lastFetch, setLastFetch] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    getUsers()
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setFetchedUsers(response);
        }
      })
      .catch(error => {
        setHttpError('Something went wrong! Please try later or contact Administrator.');
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    if (fetchedUsers.length) {
      setIsLoading(true);
      getBranches(controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setBranches(response);
            const users = fetchedUsers.map(user => {
              const userBranch = response.filter(branch => {
                return branch._id === user.branch
              });
              if (userBranch.length) {
                user.branch = userBranch[0].name;
              } else {
                user.branch = '';
              }
              return user;
            });
            setUsers(users);
            setLastFetch(true);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [fetchedUsers]);

  useEffect(() => {
    const controller = new AbortController();
    if (deleteUserId) {
      setIsLoading(true);
      removeUser(deleteUserId, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setDeleteUserId('');
            const updatedUsers = users.filter(user => user.id !== response.id);
            setUsers(updatedUsers);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [deleteUserId, users]);

  useEffect(() => {
    const controller = new AbortController();

    if (lastFetch) {
      getEmployees(controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            const updatedUsers = users.map(user => {
              const employee = response.filter(employee => employee._id === user.employee);
              if (employee && employee.length && employee[0].name) {
                user.employee = employee[0].name;
              }
              return user;
            });
            setUsers(updatedUsers);
            setLastFetch(false);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [lastFetch, users]);

  useEffect(() => {
    const controller = new AbortController();
    if (isSearched) {
      setIsLoading(true);
      searchUser(search, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            const users = response.map(user => {
              const userBranch = branches.filter(branch => {
                return branch._id === user.branch
              });
              if (userBranch.length) {
                user.branch = userBranch[0].name;
              }
              return user;
            });
            setUsers(users);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    }
    return () => {
      setIsSearched(false);
      controller.abort();
    }
  }, [isSearched, search, branches]);

  const navigateToEdit = (id) => {
    navigate('/users/userEdit', { state: { userId: id } });
  };

  const deleteUser = (id) => {
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === 'true') {
      setDeleteUserId(selectedId);
    }
    setSelectedId('');
    setIsDialogOpen(false);
  };

  const handleRegisterUser = () => {
    navigate('/users/userRegistration');
  };

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearched(true);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}

      {isDialogOpen && <Dialog isOpen={true} onClose={handleDialogClose} title='Are you sure' content='Do you want to delete the user?' warning />}

      {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
        <Alert severity='error'>{httpError}</Alert>
      </Stack>}

      <div className='page_head'>
        <h1 className='pageHead'>Users list</h1>
        <div className='page_actions'>
          <div className='bl_search'>
            <form onSubmit={handleSearch}>
              <div style={{ float: 'left' }}>
                <FormControl fullWidth>
                  <TextField variant='outlined' size='small' label='' placeholder='Search' value={search} name='search' id='search' onChange={handleSearchInput} />
                </FormControl>
              </div>
              <IconButton size='small' variant='contained' color='primary' type='submit' style={{ backgroundColor: '#1e1e1e', marginLeft: '5px' }}>
                <SearchIcon style={{ color: '#ffffff', verticalAlign: 'middle' }} />
              </IconButton>
            </form>
          </div>
          <Button variant='contained' size='small' type='button' color='primary' onClick={handleRegisterUser}>Register a user</Button>
        </div>
      </div>


      {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
        <Alert severity='error'>{httpError}</Alert>
      </Stack>}

      <DataGrid
        sx={{ backgroundColor: 'primary.contrastText' }}
        autoHeight
        density='compact'
        rows={users}
        columns={columns}
        getRowId={(row) => row.username}
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
    </>
  );
};

export default UserList;