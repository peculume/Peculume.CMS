import { useGetFragranceMixes } from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';
import FragranceMixesCard from '../fragrance-mix-card/FragranceMixCard';
import styles from './FragranceMixesList.module.scss';

const FragranceMixesList = () => {
  const { fragranceMixes } = useGetFragranceMixes();
  return (
    <div className={styles.fragranceMixesContainer}>
      {fragranceMixes.map((fragranceMix) => (
        <FragranceMixesCard
          fragranceMix={fragranceMix}
          key={fragranceMix.fragranceMixId}
        />
      ))}
    </div>
  );
};

export default FragranceMixesList;
