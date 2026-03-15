import { useNavigate } from 'react-router';
import AllLoreTable from './components/AllLoreTable';

const AllLorePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="actions-container">
        <h2>Lore</h2>
        <div>
          <button
            className="btn-primary"
            onClick={() => navigate('/lore/create')}
          >
            Create lore
          </button>
        </div>
      </div>
      <AllLoreTable />
    </div>
  );
};

export default AllLorePage;
