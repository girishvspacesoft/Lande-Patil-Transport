import { Link, useLocation, useMatch, useResolvedPath } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classes from './Navigation.module.css';
import navItems from './navList';

const Navigation = () => {
  const user = useSelector(state => state.user);
  return (

    <nav className={classes.nav}>
      <ul>
        {
          navItems.map(navItem => {
            if (user && user.type && user.type.toLowerCase() === 'user' && (navItem.to === '/users' || navItem.to === '/master')) {
              return null;
            }
            if (navItem.children && navItem.children.length > 0) {
              return <CustomLink key={navItem.to} to={navItem.to} subnav={navItem.children}>{navItem.label}</CustomLink>;
            } else {
              return <CustomLink key={navItem.to} to={navItem.to}>{navItem.label}</CustomLink>;
            }
          })
        }
      </ul>
    </nav>
  )
};

export default Navigation;

const CustomLink = ({ to, children, ...props }) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname });
  const location = useLocation();
  let isChildActive = false;
  if (!isChildActive && location.pathname.startsWith(to)) {
    isChildActive = true;
  }

  return (<li className={isActive || isChildActive ? classes.active : ''}>
    <Link to={to} {...props}>{children}</Link>
    {props.subnav && props.subnav.length > 0 && <ul>
      {props.subnav.map(subnavItem => <CustomSubLink key={subnavItem.to} subto={subnavItem.to}>{subnavItem.label}</CustomSubLink>)}
    </ul>}
  </li>)
};

const CustomSubLink = ({ subto, children, ...props }) => {
  const resolvedPath = useResolvedPath(subto);
  const isActive = useMatch({ path: resolvedPath.pathname, startsWith: true });
  const location = useLocation();
  let isChildActive = false;
  if (!isChildActive && location.pathname.startsWith(subto)) {
    isChildActive = true;
  }

  return (<li key={subto} className={isActive || isChildActive ? classes.active : ''}>
    <Link to={subto} {...props}>{children}</Link>
  </li>)
};