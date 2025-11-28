import { useNavigate } from 'react-router';
import { ProductForm } from 'components';

const CreateProductPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="header">
        <button className="backButton" onClick={() => navigate('/products')}>
          Back
        </button>
        <h2 className="title">Add product</h2>
      </div>
      <ProductForm />
    </div>
  );
};

export default CreateProductPage;
