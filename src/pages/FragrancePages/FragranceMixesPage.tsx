import { useNavigate } from 'react-router';
import FragranceMixesList from './Components/fragrance-mix/FragranceMixesList';

const FragranceMixesPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="actions-container">
        <h2>Fragrance mixes</h2>
        <div>
          <button
            className="btn-primary"
            onClick={() => navigate('/fragrance-mixes/create')}
          >
            Add fragrance mix
          </button>
        </div>
      </div>
      <FragranceMixesList />
    </div>
  );
};

export default FragranceMixesPage;
