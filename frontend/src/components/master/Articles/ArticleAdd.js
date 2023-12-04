import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, InputLabel, MenuItem, FormControl, FormHelperText, Button, Paper } from '@mui/material';
import Select from '@mui/material/Select';
import { Alert, Stack } from '@mui/material';

import { addArticle, getBranches } from '../../../lib/api-master';

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

const ArticleAdd = () => {
  const [article, setArticle] = useState(initialArticleState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [branches, setBranches] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState('');
  const [hasErrors, setHasErrors] = useState(false);

  const navigate = useNavigate();

  const goToArticlesList = useCallback(() => {
    navigate('/master/articles');
  }, [navigate]);


  useEffect(() => {
    const controller = new AbortController();

    getBranches(controller)
      .then(response => {
        if (response.message) {
          setHttpError(response.message);
        } else {
          setHttpError('');
          setBranches(response);
        }
      })
      .catch(error => {
        setHttpError(error.message);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    if (hasErrors) {
      return setIsSubmitted(false);
    }
    if (isSubmitted && !hasErrors) {
      addArticle(article, controller)
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

  const cancelButtonHandler = () => {
    resetButtonHandler();
    goToArticlesList();
  };

  const resetButtonHandler = () => {
    setArticle(initialArticleState);
    setHasErrors(false);
    setHttpError('');
    setFormErrors(initialErrorState);
  }

  const inputChangeHandler = (e) => {
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
    if (formData.branch.trim() === '') {
      errors.branch = { invalid: true, message: 'Branch is required' };
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
    <h1 className='pageHead'>Add an article</h1>
    {httpError !== '' && <Stack sx={{ width: '100%', margin: '0 0 30px 0', border: '1px solid red', borderRadius: '4px' }} spacing={2}>
      <Alert severity='error'>{httpError}</Alert>
    </Stack>}
    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <form action='' onSubmit={submitHandler}>
        <div className='grid grid-6-col'>
          <div className='grid-item'>
            <FormControl fullWidth size='small' error={formErrors.branch.invalid}>
              <InputLabel id='branch'>Branch</InputLabel>
              <Select
                labelId='branch'
                name='branch'
                value={article.branch}
                label='Branch'
                onChange={inputChangeHandler}
              >
                {branches.map(branch => <MenuItem key={branch._id} value={branch._id} className='menuItem'>{branch.name}</MenuItem>)}
              </Select>
              {formErrors.branch.invalid && <FormHelperText>{formErrors.branch.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth error={formErrors.name.invalid}>
              <TextField size='small' variant='outlined' label='Article name' value={article.name} error={formErrors.name.invalid} onChange={inputChangeHandler} name='name' id='name' />
              {formErrors.name.invalid && <FormHelperText>{formErrors.name.message}</FormHelperText>}
            </FormControl>
          </div>
          <div className='grid-item'>
            <FormControl fullWidth>
              <TextField size='small' variant='outlined' label='Article description' value={article.abbreviation} onChange={inputChangeHandler} name='description' id='description' />
            </FormControl>
          </div>
        </div>
        <div className='right'>
          <Button variant='outlined' size='medium' onClick={cancelButtonHandler}>Back</Button>
          <Button variant='outlined' size='medium' onClick={resetButtonHandler} className='ml6'>Reset</Button>
          <Button variant='contained' size='medium' type='submit' color='primary' className='ml6'>Save</Button>
        </div>
      </form>
    </Paper>
  </>;
};

export default ArticleAdd;