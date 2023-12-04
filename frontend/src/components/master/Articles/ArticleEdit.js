import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import Select from '@mui/material/Select';
import { Alert, Stack } from '@mui/material';

import { getArticle, updateArticle, getBranches } from '../../../lib/api-master';

import LoadingSpinner from '../../UI/LoadingSpinner';

const initialArticleState = {
  branch: '',
  name: '',
  description: ''
};

const initialErrorState = {
  name: {
    invalid: false,
    message: ''
  },
  branch: {
    invalid: false,
    message: ''
  }
};

const ArticleEdit = () => {
  const [article, setArticle] = useState(initialArticleState);
  const [fetchedArticle, setFetchedArticle] = useState(initialArticleState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [branches, setBranches] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const { articleId } = location.state;
  const navigate = useNavigate();

  const goToArticlesList = useCallback(() => {
    navigate('/master/articles');
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
          setBranches(response);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setHttpError(error.message);
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);


  useEffect(() => {
    const controller = new AbortController();
    if (articleId && articleId !== '') {
      setIsLoading(true);
      getArticle(articleId, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setArticle(response);
            setFetchedArticle(response);
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
  }, [articleId]);

  useEffect(() => {
    const controller = new AbortController();

    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      updateArticle(article, controller)
        .then(response => {
          if (response.message) {
            setHttpError(response.message);
          } else {
            setHttpError('');
            setArticle(initialArticleState);
            goToArticlesList();
          }
          setIsSubmitted(false);
        })
        .catch(error => {
          setHttpError(error.message);
        });
    }

    return () => {
      controller.abort();
    };
  }, [isSubmitted, hasErrors, article, goToArticlesList]);

  const backButtonHandler = () => {
    goToArticlesList();
  };

  const resetButtonHandler = () => {
    setArticle(fetchedArticle);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  };

  const inputChangeHandler = (isSelect, e) => {
    const name = e.target.name;
    const value = e.target.value;
    setArticle(currState => {
      return {
        ...currState,
        [name]: value
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(currState => validateForm(article));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {
    const errors = { ...initialErrorState };
    if (formData.name.trim() === '') {
      errors.name = { invalid: true, message: 'Article name is required' };
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

  return <>
    <h1 className='pageHead'>Edit an article</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}

    {isLoading && <LoadingSpinner />}

    {!isLoading && <form action='' onSubmit={submitHandler}>

      <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.branch.invalid}>
              <InputLabel id='branch'>Branch</InputLabel>
              <Select
                labelId='branch'
                name='branch'
                value={article.branch}
                label='Branch'
                defaultValue=''
                onChange={inputChangeHandler.bind(null, true)}
              >
                {branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
              </Select>
              {formErrors.branch.invalid && <FormHelperText>{formErrors.branch.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.name.invalid}>
              <TextField size='small' variant='outlined' label='Article name' value={article.name} error={formErrors.name.invalid} onChange={inputChangeHandler.bind(null, false)} name='name' id='name' />
              {formErrors.name.invalid && <FormHelperText>{formErrors.name.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Article description' value={article.description} onChange={inputChangeHandler.bind(null, false)} name='description' id='description' />
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

export default ArticleEdit;