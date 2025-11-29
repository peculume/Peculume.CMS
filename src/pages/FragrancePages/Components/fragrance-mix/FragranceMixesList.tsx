import { useGetFragranceMixes } from '../../Hooks/FragranceMixHooks';
import styles from '../FragranceComponents.module.scss';
import FragranceMixesCard from './fragrance-mix-card/FragranceMixCard';

const FragranceMixesList = () => {
  const { fragranceMixes } = useGetFragranceMixes();
  return (
    <div className={styles.fragranceMixesContainer}>
      {fragranceMixes.map((fragranceMix) => (
        <FragranceMixesCard fragranceMix={fragranceMix} key={fragranceMix.fragranceMixId} / >
      ))}
    </div>
  );
};

export default FragranceMixesList;
