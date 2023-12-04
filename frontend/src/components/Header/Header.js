import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useSelector, useDispatch } from 'react-redux';
import { remove } from '../../redux/userSlice';
import logo from '../../images/logo.svg';

import { getFormattedDate } from '../../lib/helper';

import classes from './Header.module.css';

const Header = () => {

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    setLoggedInUser(user);
  }, [user]);

  // const currentDate = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
  const currentDate = getFormattedDate(new Date());

  const handleLogout = () => {
    localStorage.removeItem('userData');
    dispatch(remove());
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <header className={classes.header}>
      <div className={classes.head}>
        <div className={classes.logo}><Link to='/'><img src={logo} alt="JRV Translines" /></Link></div>

        {loggedInUser && loggedInUser.username && <div className={classes.logout}>
          Date: {currentDate}<br />
          {user.employee && user.employee.name ? user.employee.name : user.username}&nbsp; <IconButton size='small' onClick={handleLogout} sx={{ color: '#b7c0cd', fontSize: '1em', '&:hover': { color: '#fff' } }}><LogoutIcon sx={{ fontSize: '1.5em' }} />&nbsp;Logout</IconButton>
        </div>}
        {(!loggedInUser || !loggedInUser.username) && <div className={classes.logout}>
          {/* Date: {currentDate}<br /> */}
          {user.employee && user.employee.name ? user.employee.name : user.username}&nbsp; <IconButton size='small' onClick={handleLogin} sx={{ color: '#b7c0cd', fontSize: '1em', '&:hover': { color: '#fff' } }}><LoginIcon sx={{ fontSize: '1.5em' }} />&nbsp;Login</IconButton>
        </div>}
      </div>
    </header>
  );
};

export default Header; 