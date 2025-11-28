import { useGetFragranceMixes } from '../Hooks/FragranceMixHook';
import styles from './FragranceComponents.module.scss';

const FragranceMixesList = () => {
  const { fragranceMixes } = useGetFragranceMixes();
  return (
    <div className={styles.fragranceMixesContainer}>
      {fragranceMixes.map((fragranceMix) => (
        <div
          key={fragranceMix.fragranceMixId}
          className={styles.fragranceMixCard}
        >
          <p>{fragranceMix.name}</p>
          <p>{fragranceMix.notes}</p>

          <p className={styles.oilsHeader}>Oils:</p>
          <div>
            {fragranceMix.fragranceOils.map((oil) => (
              <div key={oil.fragranceOilId} className={styles.oilLine}>
                <span className={styles.oilName}>{oil.name}</span>
                {' — '}
                <span>Ratio: {oil.mixRatio}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FragranceMixesList;
