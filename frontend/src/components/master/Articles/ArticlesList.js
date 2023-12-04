import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Snackbar, IconButton, Alert, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import LoadingSpinner from '../../UI/LoadingSpinner';
import Dialog from '../../UI/Dialog';

import { getArticles, removeArticle } from '../../../lib/api-master';
import { checkAuth } from '../../../lib/RequireAuth';

const ArticlesList = () => {

  const columns = [
    { field: '_id', headerName: 'Id' },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'actions', headerName: '', flex: 1, sortable: false, renderCell: (params) => {
        const triggerEdit = (e) => {
          e.stopPropagation();
          return navigateToEdit(params.row._id);
        };

        const triggerDelete = (e) => {
          e.stopPropagation();
          return deleteArticle(params.row._id);
        }

        return <>
          <IconButton size='small' onClick={triggerEdit} color='primary'><EditIcon /></IconButton>&nbsp;&nbsp;
          <IconButton size='small' onClick={triggerDelete} color='error'><DeleteIcon /></IconButton>
        </>;
      }
    }
  ];

  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [httpError, setHttpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteArticleId, setDeleteArticleId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [isUnauth, setIsUnauth] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getArticles(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setArticles(response);
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

    if (deleteArticleId) {
      setIsLoading(true);
      removeArticle(deleteArticleId, controller)
        .then(response => {
          setIsLoading(false);
          setDeleteArticleId('');
          const updatedArticles = articles.filter(article => article._id !== response.id);
          setArticles(updatedArticles);
        })
        .catch(error => {
          setIsLoading(false);
          setHttpError('Something went wrong! Please try later or contact Administrator.');
        });
    };

    return () => {
      controller.abort();
    };
  }, [deleteArticleId, articles]);

  const handleAddArticle = () => {
    navigate('/master/articles/addArticle');
  };

  const navigateToEdit = (id) => {
    if (checkAuth('master', 'articles', 'write')) {
      navigate('/master/articles/editArticle', { state: { articleId: id } });
    } else {
      setIsUnauth(true);
    }
  };

  const deleteArticle = (id) => {
    if (checkAuth('master', 'articles', 'write')) {
      setSelectedId(id);
      setIsDialogOpen(true);
    } else {
      setIsUnauth(true);
    }
  };

  const handleDialogClose = (e) => {
    setIsDialogOpen(true);
    if (e.target.value === 'true') {
      setDeleteArticleId(selectedId);
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

    {isDialogOpen && <Dialog isOpen={true} onClose={handleDialogClose} title='Are you sure?' content='Do you want to delete the article?' warning />}
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={isUnauth} autoHideDuration={6000} onClose={handleUnauthClose}>
      <Alert severity="warning">You are not authorized to perform the action</Alert>
    </Snackbar>

    <div className='page_head'>
      <h1 className='pageHead'>Article list</h1>
      <div className='page_actions'>
        <Button variant='contained' size='small' type='button' color='primary' className='ml6' onClick={handleAddArticle}>Add an article</Button>
      </div>
    </div>

    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}

    <div style={{ width: '100%' }}>
      <DataGrid
        sx={{ backgroundColor: 'primary.contrastText' }}
        autoHeight
        density='compact'
        getRowId={(row) => row._id}
        rows={articles}
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
    </div>
  </>;
};

export default ArticlesList;