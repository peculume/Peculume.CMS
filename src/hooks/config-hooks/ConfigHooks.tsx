import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL, BUILD_TIME_API_KEY } from 'api/config';
import { FragranceMixStatus } from 'types/fragranceTypes';

const useGetAllFragranceMixStatuses = () => {
  const { data = [] } = useQuery({
    queryKey: ['getAllFragranceMixStatuses'],
    queryFn: async () => {
      const url = new URL(`${API_BASE_URL}/config/fragrance-mix-statuses`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-Build-Time-Api-Key': BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching products: ${response.status}`;
      }
      const resp = (await response.json()) as FragranceMixStatus[];
      return resp;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    fragranceMixStatuses: data,
  };
};

export { useGetAllFragranceMixStatuses };
