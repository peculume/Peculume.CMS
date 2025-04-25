import { useNavigate } from "react-router";
import ProductForm from "components/ProductForm/ProductForm";
import styles from "./CreateProductPage.module.scss";

const CreateProductPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate("/products")}>Back</button>
        <h2 className={styles.title}>Add product</h2>
      </div>
      <ProductForm />
    </div>
  );
};

export default CreateProductPage;
