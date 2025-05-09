import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, BUILD_TIME_API_KEY } from "api/config";
import { Product } from "types/productTypes";
import { ProductForm } from "components";
import styles from "./ProductPage.module.scss";

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { data: product } = useQuery({
    queryKey: ["getProduct", productId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'GET',
        headers: {
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching product: ${response.status}`;
      }
      const resp = await response.json() as Product;
      return resp;
    }
  })

  if (!product) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate("/products")}>Back</button>
        <h2 className={styles.title}>{product.name}</h2>
      </div>
      <ProductForm product={product} />
    </div>
  );
};

export default ProductPage;