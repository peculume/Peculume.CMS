import { useNavigate } from "react-router";
import styles from "./MediaPage.module.scss";
import MediaTable from "components/MediaTable/MediaTable";

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