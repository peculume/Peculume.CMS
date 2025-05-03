import { useNavigate } from "react-router";
import { format } from "date-fns";
import { useGetProducts } from "hooks/ProductHooks/ProductHooks";

const ProductTable = () => {
  const navigate = useNavigate();
  const { products } = useGetProducts();
  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
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
            <td>{format(new Date(product.lastModifiedAt), "dd MMM yyyy HH:mm")}</td>
            <td>Active | Draft | Hidden</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;