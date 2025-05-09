import { useNavigate } from "react-router";
import { MediaTable } from "components";
import styles from "./MediaPage.module.scss";

const MediaPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.mediaActionsContainer}>
        <h2>Media</h2>
        <div>
          <button className="btn-primary" onClick={() => navigate("/media/create")}>Add media</button>
        </div>
      </div>
      <MediaTable />
    </div>
  );
};

export default MediaPage;