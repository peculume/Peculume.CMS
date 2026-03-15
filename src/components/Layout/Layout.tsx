import { FC, ReactNode, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from 'providers/AuthProvider';
import { FullPageLoader } from 'components';
import styles from './Layout.module.scss';

type LayoutProps = {
  children: ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthInitialising, user, logout } = useAuth();

  useEffect(() => {
    if (isAuthInitialising) {
      return;
    }

    if (!user) {
      navigate('/login');
    }
  });

  if (isAuthInitialising || !user) {
    return <FullPageLoader />;
  }

  if (!user.verified) {
    return <p>Account is not verified</p>;
  }

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.layoutHeaderContainer}>
        <NavLink to="/">
          <h1>Peculume CMS</h1>
        </NavLink>
        <button onClick={logout}>Logout</button>
      </header>
      <div className={styles.layoutBodyContainer}>
        <div className={styles.layoutSidebarContainer}>
          <div className={styles.layoutSidebarSection}>
            <h2>Shop</h2>
            <NavLink
              to={'/products'}
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
            >
              Products
            </NavLink>
            <NavLink
              to={'/media'}
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
            >
              Media
            </NavLink>
          </div>
          <div className={styles.layoutSidebarSection}>
            <h2>Lab</h2>
            <NavLink
              to={'/kanban'}
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
            >
              Kanban
            </NavLink>
            <NavLink
              to={'/fragrance-oils'}
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
            >
              Fragrance oils
            </NavLink>
            <NavLink
              to={'/fragrance-mixes'}
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
            >
              Fragrance mixes
            </NavLink>
            <NavLink
              to={'/prototypes'}
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
            >
              Prototypes
            </NavLink>
          </div>
          <div className={styles.layoutSidebarSection}>
            <h2>Content</h2>
            <NavLink
              to={'/lore'}
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
            >
              Lore
            </NavLink>
          </div>
        </div>
        <div className={styles.layoutPageContainer}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
