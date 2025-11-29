import { BeakerIcon } from 'icons/Icons';
import styles from './FragranceMixCard.module.scss';
import { FragranceMix } from 'types/fragranceTypes';

const FragranceMixesCard = ({
  fragranceMix,
}: {
  fragranceMix: FragranceMix;
}) => {
  console.log('FragranceMixesCard render', fragranceMix);
  return (
    <div key={fragranceMix.fragranceMixId} className={styles.fragranceMixCard}>
      <div className={styles.cardHeader}>
        <div>
          <BeakerIcon className={styles.fragranceIcon} />
          <p>{fragranceMix.name}</p>
        </div>
        <span
          className={styles.statusPill}
          style={{ background: `#${fragranceMix.status.colourHex}` }}
        >
          {fragranceMix.status.name}
        </span>
        {/* ^ make component? How do we decide on status colour? */}
      </div>
      <p>{fragranceMix.notes}</p>

      <p className={styles.oilsHeader}>Versions:</p>
      <div>
        {fragranceMix.versions.map((version) => (
          <div id={version.version}>
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
  );
};

export default FragranceMixesCard;
