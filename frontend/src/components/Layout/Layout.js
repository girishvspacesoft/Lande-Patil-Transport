import { useSelector } from 'react-redux';
import Footer from '../Footer/Footer';
import classes from './Layout.module.css';
import Navigation from '../Navigation/Navigation';
import Header from '../Header/Header';

const Layout = (props) => {
  const user = useSelector(state => state.user);
  return <>
    <Header />
    {user && user.username && <div>
      <div className={classes['left-panel']}><Navigation /></div>
      <div className={classes['right-panel']}>
        <main className={classes.main}>
          {props.children}
        </main>
        <Footer />
      </div>
    </div>}

    {!user.username && <div className='bl_login'>
      <main className={classes.main}>
        {props.children}
      </main>
    </div>}
  </>;
};

export default Layout;