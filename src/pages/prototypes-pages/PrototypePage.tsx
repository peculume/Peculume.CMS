import { useGetPrototypeById } from 'hooks/prototype-hooks/PrototypeHooks';
import { useNavigate, useParams } from 'react-router';
import PrototypeForm from './components/PrototypeForm';

const PrototypePage = () => {
  const { prototypeId } = useParams();
  const navigate = useNavigate();

  const { prototype, isPrototypeLoading } = useGetPrototypeById(prototypeId);

  if (isPrototypeLoading) {
    return <div>Loading...</div>;
  }

  if (!prototype) {
    return <div>Prototype not found</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <button className="backButton" onClick={() => navigate('/prototypes')}>
          Back
        </button>
        <h2 className="title">{prototype.name}</h2>
      </div>
      <PrototypeForm prototype={prototype} />
    </div>
  );
};

export default PrototypePage;
