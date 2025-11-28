import { useNavigate } from 'react-router';
import FragranceMixForm from './Components/FragranceMixForm';

const CreateFragranceMixPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="header">
        <button
          className="backButton"
          onClick={() => navigate('/fragrance-mixes')}
        >
          Back
        </button>
        <h2 className="title">Add fragrance mix</h2>
      </div>
      <FragranceMixForm />
    </div>
  );
};

export default CreateFragranceMixPage;
