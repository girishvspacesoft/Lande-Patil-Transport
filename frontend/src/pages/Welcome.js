import { useSelector } from 'react-redux';

import Login from '../components/user/Login';
// import AdminRegistration from '../components/user/AdminRegistration';

const Welcome = () => {
  const user = useSelector(state => state.user);

  return (
    <>
      <h1 className='pageHead' style={{ textAlign: 'center' }}>Welcome {user && user.employee && user.employee.name ? user.employee.name : ''} to <br /> {process.env.REACT_APP_TITLE}</h1>
      {user.username === '' && <Login />}
      {/* <AdminRegistration /> */}
    </>
  );
};

export default Welcome;