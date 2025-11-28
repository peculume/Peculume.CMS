import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL, BUILD_TIME_API_KEY } from 'api/config';
import { FragranceOil } from 'types/fragranceTypes';
import FragranceOilForm from './Components/FragranceOilForm';

const FragranceMixPage = () => {
  const { fragranceOilId } = useParams();
  const navigate = useNavigate();

  const { data: fragranceOil } = useQuery({
    queryKey: ['getFragranceOil', fragranceOilId],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/fragrance-oils/id/${fragranceOilId}`,
        {
          method: 'GET',
          headers: {
            'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
          },
        },
      );
      if (!response.ok) {
        throw `Error fetching product: ${response.status}`;
      }
      const resp = (await response.json()) as FragranceOil;
      return resp;
    },
  });

  if (!fragranceOil) {
    return null;
  }

  return (
    <div className="container">
      <div className="header">
        <button
          className="backButton"
          onClick={() => navigate('/fragrance-oils')}
        >
          Back
        </button>
        <h2 className="title">{fragranceOil.name}</h2>
      </div>
      <FragranceOilForm fragranceOil={fragranceOil} />
    </div>
  );
};

export default FragranceMixPage;
