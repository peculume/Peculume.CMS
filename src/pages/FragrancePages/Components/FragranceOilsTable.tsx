import { useNavigate } from 'react-router';
import { useGetFragranceOils } from '../Hooks/FragranceOilHooks';

const FragranceOilsTable = () => {
  const navigate = useNavigate();
  const { fragranceOils } = useGetFragranceOils();
  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {fragranceOils.map((fragrance) => (
          <tr
            key={fragrance.fragranceOilId}
            onClick={() =>
              navigate(`/fragrance-oils/${fragrance.fragranceOilId}`)
            }
            data-clickable
          >
            <td>{fragrance.name}</td>
            <td>{fragrance.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FragranceOilsTable;
