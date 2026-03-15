import { useNavigate } from 'react-router';
import LoreForm from './components/LoreFrom';

const CreateFragranceMixPage = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="header">
        <button className="backButton" onClick={() => navigate('/lore')}>
          Back
        </button>
        <h2 className="title">Add Lore</h2>
      </div>
      <LoreForm />
    </div>
  );
};

export default CreateFragranceMixPage;
