import { useState, useMemo } from 'react';
import { useGetFragranceMixes } from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';
import { useGetFragranceCategories } from 'pages/fragrance-oil-pages/hooks/FragranceOilHooks';
import FragranceMixesCard from '../fragrance-mix-card/FragranceMixCard';
import styles from './FragranceMixesList.module.scss';

const FragranceMixesList = () => {
  const { fragranceMixes } = useGetFragranceMixes();
  const { fragranceOilCategories = [] } = useGetFragranceCategories();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5]);

  const filteredMixes = useMemo(() => {
    return fragranceMixes.filter((mix) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        mix.categories.some((c) => selectedCategories.includes(c.categoryId));

      const ratingMatch = mix.versions.some(
        (v) => v.rating >= ratingRange[0] && v.rating <= ratingRange[1],
      );

      return categoryMatch && ratingMatch;
    });
  }, [fragranceMixes, selectedCategories, ratingRange]);

  return (
    <div className={styles.fragranceMixesListContainer}>
      <div className={styles.fragranceMixesFilterContainer}>
        <h3>Filter by category</h3>
        <div className={styles.pillsContainer}>
          {fragranceOilCategories.map((category) => {
            const isActive = selectedCategories.includes(category.categoryId);
            return (
              <div
                key={category.categoryId}
                className={`${styles.pill} ${isActive ? styles.active : ''}`}
                onClick={() =>
                  setSelectedCategories((prev) =>
                    isActive
                      ? prev.filter((id) => id !== category.categoryId)
                      : [...prev, category.categoryId],
                  )
                }
              >
                {category.name}
              </div>
            );
          })}
        </div>
        <h3>Filter by version rating</h3>
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
