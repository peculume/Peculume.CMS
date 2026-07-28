import { useNavigate } from "react-router";
import { format } from "date-fns";
import { useGetProducts } from "hooks/ProductHooks/ProductHooks";
import styles from "./ProductTable.module.scss";

const formatVersion = (version?: string | null) => {
  if (!version) {
    return "-";
  }

  return version.toLowerCase().startsWith("v") ? version : `v${version}`;
};

const ProductTable = () => {
  const navigate = useNavigate();
  const { products } = useGetProducts();
  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Current version</th>
          <th>Versions</th>
          <th>Last updated</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr
            key={product.productId}
            onClick={() => navigate(`/products/${product.productId}`)}
            data-clickable
          >
            <td>{product.name}</td>
            <td>
              <span className={styles.versionPill}>
                {formatVersion(product.activeVersion?.version)}
              </span>
            </td>
            <td>{product.versions.length}</td>
            <td>{format(new Date(product.lastModifiedAt), "dd MMM yyyy HH:mm")}</td>
            <td>
              <span
                className={`${styles.statusPill} ${
                  styles[product.activeVersion?.status.toLowerCase() ?? ""]
                }`}
              >
                {product.activeVersion?.status ?? "Unversioned"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
