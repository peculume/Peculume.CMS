import { useNavigate, useParams } from 'react-router';
import { useGetLoreById } from 'hooks/lore-hooks/LoreHooks';
import LoreForm from './components/LoreForm';

const LorePage = () => {
  const { loreId } = useParams();
  const navigate = useNavigate();
  const { lore, loreLoading } = useGetLoreById(loreId);

  if (loreLoading) {
    return <div>Loading...</div>;
  }

  if (!lore) {
    return <div>Lore not found</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <button className="backButton" onClick={() => navigate('/lore')}>
          Back
        </button>
        <h2 className="title">{lore.name}</h2>
      </div>
      <LoreForm lore={lore} />
    </div>
  );
};

export default LorePage;
