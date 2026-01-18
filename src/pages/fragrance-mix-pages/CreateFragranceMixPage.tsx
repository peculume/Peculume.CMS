import { useNavigate } from 'react-router';
import { CreateFragranceMixForm } from './components';

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
      <CreateFragranceMixForm />
    </div>
  );
};

export default CreateFragranceMixPage;
