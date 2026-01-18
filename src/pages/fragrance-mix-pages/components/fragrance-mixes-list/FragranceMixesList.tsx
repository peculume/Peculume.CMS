import { useState, useMemo } from 'react';
import { useGetFragranceMixes } from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';
import { useGetFragranceCategories } from 'pages/fragrance-oil-pages/hooks/FragranceOilHooks';
import FragranceMixesCard from '../fragrance-mix-card/FragranceMixCard';
import styles from './FragranceMixesList.module.scss';

const FragranceMixesList = () => {
  const { fragranceMixes } = useGetFragranceMixes();
  const { fragranceOilCategories = [] } = useGetFragranceCategories();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const filteredMixes = useMemo(() => {
    if (selectedCategories.length === 0) return fragranceMixes;
    return fragranceMixes.filter((mix) =>
      mix.categories.some((c) => selectedCategories.includes(c.categoryId)),
    );
  }, [fragranceMixes, selectedCategories]);

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
