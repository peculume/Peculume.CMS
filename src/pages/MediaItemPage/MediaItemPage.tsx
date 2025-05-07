import { useNavigate, useParams } from "react-router";
import { useGetMediaById } from "hooks/MediaHooks/MediaHooks";
import { useState } from "react";
import styles from "./MediaItemPage.module.scss";

const MediaItemPage = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const { media } = useGetMediaById(mediaId);
  const [isLoading, setIsLoading] = useState(true);

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
        {isLoading && <div className={styles.spinner}>Loading...</div>}
        <img
          src={media.url}
          alt={media.name}
          className={`${styles.image} ${isLoading ? styles.hidden : ""}`}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};

export default MediaItemPage;
