import { FC, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from 'providers/AuthProvider';
import styles from './Layout.module.scss';

type LayoutProps = {
  children: ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { authData, setJwt } = useAuth();

  const handleLogout = () => {
    setJwt(null);
    navigate('/login');
  };

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.layoutHeaderContainer}>
        <Link to="/">
          <h1>Peculume CMS</h1>
        </Link>
        {authData && <button onClick={handleLogout}>Logout</button>}
      </header>
      <div className={styles.layoutBodyContainer}>
        {!!authData && authData.adminUser.verified && (
          <div className={styles.layoutSidebarContainer}>
            <div className={styles.layoutSidebarSection}>
              <h2>Shop</h2>
              <Link to={'/products'}>Products</Link>
              <Link to={'/media'}>Media</Link>
            </div>
            <div className={styles.layoutSidebarSection}>
              <h2>Lab</h2>
              <Link to={'/fragrance-oils'}>Fragrance oils</Link>
            </div>
          </div>
        )}
        <div className={styles.layoutPageContainer}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
