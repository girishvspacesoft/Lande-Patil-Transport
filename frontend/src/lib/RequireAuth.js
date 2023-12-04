import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireAuth = ({ parent, path, process, children }) => {
  const user = useSelector(state => state.user);

  if (user.type.toLowerCase() === 'admin') {
    return children;
  }

  if (user.permissions[parent][path][process]) {
    return children;
  } else {
    return <Navigate to='/unauthorized' replace />
  }

};

export default RequireAuth;

export const checkAuth = (parent, path, process) => {
  const user = JSON.parse(localStorage.getItem('userData'));
  if (user && user.type && user.type.toLowerCase() === 'admin') {
    return true;
  }
  const userState = user && user.username ? user : {};
  return userState.permissions[parent][path][process];
};