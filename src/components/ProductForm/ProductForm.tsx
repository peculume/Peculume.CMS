import { FC, useState } from "react";
import { Product } from "types/productTypes";
import styles from "./ProductForm.module.scss";

type ProductFormTypes = {
  product?: Product;
}

const ProductForm: FC<ProductFormTypes> = ({ product }) => {
  const [title, setTitle] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [description, setDescription] = useState('');

  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="slug">Slug</label>
        <input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <input className={styles.submitButton} type="submit" value="Save" />
    </form>
  );
};

export default ProductForm;