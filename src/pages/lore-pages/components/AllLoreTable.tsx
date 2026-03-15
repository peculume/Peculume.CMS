import { useNavigate } from 'react-router';
import { useGetLore } from 'hooks/lore-hooks/LoreHooks';

const AllLoreTable = () => {
  const navigate = useNavigate();
  const { lore } = useGetLore();
  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {lore.map((l) => (
          <tr key={l.loreId} onClick={() => navigate(`/lore/${l.loreId}`)}>
            <td>{l.name}</td>
            <td>{l.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AllLoreTable;
