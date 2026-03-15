import { useState, useMemo } from 'react';
import { useGetFragranceMixes } from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';
import { useGetFragranceCategories } from 'pages/fragrance-oil-pages/hooks/FragranceOilHooks';
import { useGetAllFragranceMixStatuses } from 'hooks/config-hooks/ConfigHooks';
import FragranceMixesCard from '../fragrance-mix-card/FragranceMixCard';
import styles from './FragranceMixesList.module.scss';

const FragranceMixesList = () => {
  const { fragranceMixes } = useGetFragranceMixes();
  const { fragranceOilCategories = [] } = useGetFragranceCategories();
  const { fragranceMixStatuses = [] } = useGetAllFragranceMixStatuses();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5]);

  const filteredMixes = useMemo(() => {
    return fragranceMixes.filter((mix) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        mix.categories.some((c) => selectedCategories.includes(c.categoryId));

      const statusMatch =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(mix.status.fragranceMixStatusId);

      const ratingMatch = mix.versions.some(
        (v) => v.rating >= ratingRange[0] && v.rating <= ratingRange[1],
      );

      return categoryMatch && statusMatch && ratingMatch;
    });
  }, [fragranceMixes, selectedCategories, selectedStatuses, ratingRange]);

  const toggleCategory = (id: number) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleStatus = (id: number) =>
    setSelectedStatuses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <div className={styles.fragranceMixesListContainer}>
      <div className={styles.fragranceMixesFilterContainer}>
        <div className={styles.filterSection}>
          <span className={styles.filterLabel}>Category</span>
          <div className={styles.pillsContainer}>
            {fragranceOilCategories.map((category) => {
              const isActive = selectedCategories.includes(category.categoryId);
              return (
                <div
                  key={category.categoryId}
                  className={`${styles.pill} ${isActive ? styles.active : ''}`}
                  onClick={() => toggleCategory(category.categoryId)}
                >
                  {category.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.filterSection}>
          <span className={styles.filterLabel}>Status</span>
          <div className={styles.pillsContainer}>
            {fragranceMixStatuses.map((status) => {
              const isActive = selectedStatuses.includes(
                status.fragranceMixStatusId,
              );
              return (
                <div
                  key={status.fragranceMixStatusId}
                  className={styles.pill}
                  onClick={() => toggleStatus(status.fragranceMixStatusId)}
                  style={
                    isActive
                      ? {
                          background: `#${status.colourHex}`,
                          borderColor: `#${status.colourHex}`,
                          color: '#fff',
                        }
                      : undefined
                  }
                >
                  <span
                    className={styles.statusDot}
                    style={{ background: `#${status.colourHex}` }}
                  />
                  {status.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.filterSection}>
          <span className={styles.filterLabel}>Version rating</span>
          <div className={styles.ratingRangeContainer}>
            <div className={styles.ratingRangeLabels}>
              <span>{ratingRange[0]}</span>
              <span>–</span>
              <span>{ratingRange[1]}</span>
            </div>
            <div className={styles.ratingSliders}>
              <input
                type="range"
                min={0}
                max={5}
                value={ratingRange[0]}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setRatingRange(([, max]) => [Math.min(val, max), max]);
                }}
              />
              <input
                type="range"
                min={0}
                max={5}
                value={ratingRange[1]}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setRatingRange(([min]) => [min, Math.max(val, min)]);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.fragranceMixesContainer}>
        {filteredMixes.map((fragranceMix) => (
          <FragranceMixesCard
            key={fragranceMix.fragranceMixId}
            fragranceMix={fragranceMix}
          />
        ))}
      </div>
    </div>
  );
};

export default FragranceMixesList;
