import { useGetFragranceMixes } from '../Hooks/FragranceMixHooks';
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

          <p className={styles.oilsHeader}>Versions:</p>
          <div>
            {fragranceMix.versions.map((version) => (
              <div>
                <p>
                  <b>V</b>
                  {version.version}
                </p>
                {version.fragranceOils.map((oil) => (
                  <div key={oil.fragranceOilId} className={styles.oilLine}>
                    <span className={styles.oilName}>{oil.name}</span>
                    {' — '}
                    <span>Ratio: {oil.mixRatio}%</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FragranceMixesList;
