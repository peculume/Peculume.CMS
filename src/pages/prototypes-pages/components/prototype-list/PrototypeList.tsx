import {
  useGetPrototypes,
  useGetPrototypeStatuses,
} from 'hooks/prototype-hooks/PrototypeHooks';
import PrototypeCard from '../prototype-card/PrototypeCard';
import styles from './PrototypeList.module.scss';

const PrototypeList = () => {
  const { prototypes } = useGetPrototypes();
  const { prototypeStatuses } = useGetPrototypeStatuses();

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {prototypes.map((prototype) => (
          <PrototypeCard
            key={prototype.prototypeId}
            prototype={prototype}
            status={prototypeStatuses.find(
              (s) => s.prototypeStatusId === prototype.statusId,
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default PrototypeList;
