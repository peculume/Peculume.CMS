import { useNavigate } from 'react-router';
import PrototypeList from './components/prototype-list/PrototypeList';

const AllPrototypesPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="actions-container">
        <h2>Prototypes</h2>
        <div>
          <button
            className="btn-primary"
            onClick={() => navigate('/prototypes/create')}
          >
            Add prototype
          </button>
        </div>
      </div>
      <PrototypeList />
    </div>
  );
};

export default AllPrototypesPage;
