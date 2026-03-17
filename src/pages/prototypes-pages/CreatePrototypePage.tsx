import { useNavigate } from 'react-router';
import PrototypeForm from './components/PrototypeForm';

const CreatePrototypePage = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="header">
        <button className="backButton" onClick={() => navigate('/prototypes')}>
          Back
        </button>
        <h2 className="title">Add prototype</h2>
      </div>
      <PrototypeForm />
    </div>
  );
};

export default CreatePrototypePage;
