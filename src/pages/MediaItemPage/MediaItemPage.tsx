import { useNavigate, useParams } from "react-router";
import { useGetMediaById } from "hooks/MediaHooks/MediaHooks";
import { Image } from "components";
import styles from "./MediaItemPage.module.scss";

const MediaItemPage = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const { media } = useGetMediaById(mediaId);

  if (!media) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate("/media")}>Back</button>
        <h2 className={styles.title}>{media.name}</h2>
      </div>
      <div className={styles.imageContainer}>
        <Image url={media.url} alt={media.name} />
      </div>
    </div>
  );
};

export default MediaItemPage;
