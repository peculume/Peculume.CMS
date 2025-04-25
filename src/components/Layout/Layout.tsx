import { FC, ReactNode } from "react"
import { Link } from "react-router";
import styles from "./Layout.module.scss";

type LayoutProps = {
  children: ReactNode,
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      <header>
        <Link to="/">
          <h1>Peculume CMS</h1>
        </Link>
      </header>
      <div className={styles.layoutBodyContainer}>
        {children}
      </div>
    </div>
  );
};

export default Layout;