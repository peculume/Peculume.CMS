import { useNavigate } from 'react-router';
import FragranceOilForm from './components/fragrance-oil-form/FragranceOilForm';

const CreateFragranceOilPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="header">
        <button
          className="backButton"
          onClick={() => navigate('/fragrance-oils')}
        >
          Back
        </button>
        <h2 className="title">Add fragrance</h2>
      </div>
      <FragranceOilForm />
    </div>
  );
};

export default CreateFragranceOilPage;
