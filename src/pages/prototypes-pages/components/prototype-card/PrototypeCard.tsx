import { FC } from 'react';
import { Link } from 'react-router';
import { Prototype, PrototypeStatus } from 'hooks/prototype-hooks/PrototypeHooks';
import styles from './PrototypeCard.module.scss';

type PrototypeCardProps = {
  prototype: Prototype;
  status: PrototypeStatus | undefined;
};

const PrototypeCard: FC<PrototypeCardProps> = ({ prototype, status }) => {
  const lastUpdated = new Date(prototype.lastModifiedAt).toLocaleDateString(
    undefined,
    { day: 'numeric', month: 'short', year: 'numeric' },
  );

  return (
    <Link to={`/prototypes/${prototype.prototypeId}`} className={styles.card}>
      <div className={styles.cardHeader}>
        <p className={styles.name}>{prototype.name}</p>
        {status && (
          <span
            className={styles.statusPill}
            style={{ background: `#${status.colourHex}` }}
          >
            {status.name}
          </span>
        )}
      </div>

      {prototype.categories.length > 0 && (
        <div className={styles.categories}>
          {prototype.categories.map((category) => (
            <span key={category.categoryId} className={styles.categoryPill}>
              {category.name}
            </span>
          ))}
        </div>
      )}

      {prototype.description && (
        <p className={styles.description}>{prototype.description}</p>
      )}

      {prototype.fragranceMixes.length > 0 && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Fragrance mix candidates</span>
          <div className={styles.mixList}>
            {prototype.fragranceMixes.map((mix) => (
              <span key={mix.fragranceMixId} className={styles.mixItem}>
                {mix.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <span className={styles.footer}>Updated {lastUpdated}</span>
    </Link>
  );
};

export default PrototypeCard;
