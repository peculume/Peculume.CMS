import { useNavigate } from "react-router";
import { ProductTable } from "components";

const ProductsPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="actions-container">
        <h2>Products</h2>
        <div>
          <button className="btn-primary" onClick={() => navigate("/products/create")}>Add product</button>
        </div>
      </div>
      <ProductTable />
    </div>
  );
};

export default ProductsPage;