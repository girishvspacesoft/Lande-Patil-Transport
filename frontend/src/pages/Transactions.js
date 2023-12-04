import { Outlet } from 'react-router-dom';

const Transactions = () => {
  return (
    <>
      <p>Transactions page</p>
      <Outlet />
    </>
  );
};

export default Transactions;