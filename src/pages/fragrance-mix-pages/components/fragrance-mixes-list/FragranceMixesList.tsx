import { useGetFragranceMixes } from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';
import FragranceMixesCard from '../fragrance-mix-card/FragranceMixCard';
import styles from './FragranceMixesList.module.scss';

const FragranceMixesList = () => {
  const { fragranceMixes } = useGetFragranceMixes();
  return (
    <div className={styles.fragranceMixesContainer}>
      {fragranceMixes.map((fragranceMix) => (
        <FragranceMixesCard
          key={fragranceMix.fragranceMixId}
          fragranceMix={fragranceMix}
        />
      ))}
    </div>
  );
};

export default FragranceMixesList;
