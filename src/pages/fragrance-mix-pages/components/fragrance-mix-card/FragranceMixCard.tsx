import { Link } from 'react-router';
import { FragranceMix } from 'types/fragranceTypes';
import { BeakerIcon } from 'icons/Icons';
import styles from './FragranceMixCard.module.scss';

const FragranceMixesCard = ({
  fragranceMix,
}: {
  fragranceMix: FragranceMix;
}) => {
  const latestVersion = fragranceMix.versions[fragranceMix.versions.length - 1];
  return (
    <Link to={`/fragrance-mixes/${fragranceMix.fragranceMixId}`}>
      <div className={styles.fragranceMixCard}>
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

        <div>
          {latestVersion && (
            <>
              <p className={styles.oilsHeader}>
                Latest Version - V{latestVersion.version}
              </p>
              <div
                key={latestVersion.fragranceMixVersionId}
                id={latestVersion.version}
              >
                {latestVersion.fragranceOils.map((oil) => (
                  <div key={oil.fragranceOilId} className={styles.oilLine}>
                    <span className={styles.oilName}>{oil.name}</span>
                    {' — '}
                    <span>Ratio: {oil.mixRatio}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FragranceMixesCard;
