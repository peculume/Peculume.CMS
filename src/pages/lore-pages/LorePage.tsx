import { useNavigate } from 'react-router';

const LorePage = () => {
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
    </div>
  );
};

export default LorePage;
