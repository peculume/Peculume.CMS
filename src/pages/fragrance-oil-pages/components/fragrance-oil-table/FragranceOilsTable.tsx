import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useGetFragranceOils } from 'pages/fragrance-oil-pages/hooks/FragranceOilHooks';
import { FragranceOil } from 'types/fragranceTypes';

type SortColumn = 'name' | 'brand' | 'notes';
type SortDirection = 'asc' | 'desc';

const FragranceOilsTable = () => {
  const navigate = useNavigate();
  const { fragranceOils } = useGetFragranceOils();
  const [filterText, setFilterText] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleHeaderClick = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortIndicator = (column: SortColumn) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const processedOils = useMemo(() => {
    const lower = filterText.toLowerCase();
    const filtered = lower
      ? fragranceOils.filter(
          (f: FragranceOil) =>
            f.name.toLowerCase().includes(lower) ||
            f.brand.toLowerCase().includes(lower),
        )
      : fragranceOils;

    return [...filtered].sort((a, b) => {
      const aVal = (a[sortColumn] ?? '').toLowerCase();
      const bVal = (b[sortColumn] ?? '').toLowerCase();
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [fragranceOils, filterText, sortColumn, sortDirection]);

  return (
    <>
      <input
        type="search"
        placeholder="Filter by name or brand…"
        style={{ width: '100%', marginBottom: '1rem' }}
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th
              onClick={() => handleHeaderClick('name')}
              style={{ cursor: 'pointer' }}
            >
              Product{sortIndicator('name')}
            </th>
            <th
              onClick={() => handleHeaderClick('brand')}
              style={{ cursor: 'pointer' }}
            >
              Brand{sortIndicator('brand')}
            </th>
            <th
              onClick={() => handleHeaderClick('notes')}
              style={{ cursor: 'pointer' }}
            >
              Notes{sortIndicator('notes')}
            </th>
          </tr>
        </thead>
        <tbody>
          {processedOils.map((fragrance) => (
            <tr
              key={fragrance.fragranceOilId}
              onClick={() =>
                navigate(`/fragrance-oils/${fragrance.fragranceOilId}`)
              }
              data-clickable
            >
              <td>{fragrance.name}</td>
              <td>{fragrance.brand}</td>
              <td>{fragrance.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default FragranceOilsTable;
