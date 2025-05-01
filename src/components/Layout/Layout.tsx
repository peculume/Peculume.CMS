import { FC, ReactNode } from "react"
import { Link } from "react-router";
import styles from "./Layout.module.scss";
import { useAuth } from "providers/AuthProvider";

type LayoutProps = {
  children: ReactNode,
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { authData } = useAuth();

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.layoutHeaderContainer}>
        <Link to="/">
          <h1>Peculume CMS</h1>
        </Link>
      </header>
      <div className={styles.layoutBodyContainer}>
        {(!!authData && authData.adminUser.verified) && (
          <div className={styles.layoutSidebarContainer}>
            <Link to={"/products"}>Products</Link>
          </div>
        )}
        <div className={styles.layoutPageContainer}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;