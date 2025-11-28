import { useNavigate } from 'react-router';
import FragranceOilsTable from './Components/FragranceOilsTable';

const FragranceOilsPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="actions-container">
        <h2>Fragrance oils</h2>
        <div>
          <button
            className="btn-primary"
            onClick={() => navigate('/fragrance-oils/create')}
          >
            Add fragrance oil
          </button>
        </div>
      </div>
      <FragranceOilsTable />
    </div>
  );
};

export default FragranceOilsPage;
