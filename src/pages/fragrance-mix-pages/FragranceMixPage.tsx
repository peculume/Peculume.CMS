import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL, BUILD_TIME_API_KEY } from 'api/config';
import { FragranceMix } from 'types/fragranceTypes';
import { useGetAllFragranceMixStatuses } from 'hooks/config-hooks/ConfigHooks';
import EditFragranceMixForm from './components/edit-fragrance-mix-form/EditFragranceMixForm';

const FragranceMixPage = () => {
  const { fragranceMixId } = useParams();
  const navigate = useNavigate();

  const { data: fragranceMix } = useQuery({
    queryKey: ['getFragranceMix', fragranceMixId],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/fragrance-mixes/id/${fragranceMixId}`,
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
      const resp = (await response.json()) as FragranceMix;
      setStatus(resp.status);
      return resp;
    },
  });

  const { fragranceMixStatuses, isFragranceMixStatusesLoading } =
    useGetAllFragranceMixStatuses();

  const [status, setStatus] = useState(fragranceMix?.status);

  if (!fragranceMix || !status) {
    return null;
  }

  return (
    <div className="container">
      <div className="header">
        <button
          className="backButton"
          onClick={() => navigate('/fragrance-mixes')}
        >
          Back
        </button>
        <h2 className="title">{fragranceMix.name}</h2>
        {!isFragranceMixStatusesLoading && status && (
          <select
            value={status.fragranceMixStatusId}
            onChange={(e) => {
              const selectedStatus = fragranceMixStatuses.find(
                (status) =>
                  status.fragranceMixStatusId === Number(e.target.value),
              );
              if (selectedStatus) {
                setStatus(selectedStatus);
              }
            }}
          >
            {fragranceMixStatuses.map((status) => (
              <option
                key={status.fragranceMixStatusId}
                value={status.fragranceMixStatusId}
              >
                {status.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <EditFragranceMixForm fragranceMix={fragranceMix} status={status} />
    </div>
  );
};

export default FragranceMixPage;
