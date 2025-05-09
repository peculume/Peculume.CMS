import { FC, useState } from "react";
import styles from "./Image.module.scss";

type ImageProps = {
  url: string;
  alt: string;
};

const Image: FC<ImageProps> = ({ url, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <div className={styles.spinner}>Loading...</div>}
      <img
        src={url}
        alt={alt}
        className={`${styles.image} ${isLoading ? styles.hidden : ""}`}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
};

export default Image;