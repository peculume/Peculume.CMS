import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { API_BASE_URL, BUILD_TIME_API_KEY } from "api/config";
import { Product } from "types/productTypes";

const ProductTable = () => {
  const navigate = useNavigate();

  const { data: products = [] } = useQuery({
    queryKey: ["getProducts"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: 'GET',
        headers: {
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching products: ${response.status}`;
      }
      const resp = await response.json() as Product[];
      return resp;
    },
    staleTime: 1000 * 60 * 5,
  })

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