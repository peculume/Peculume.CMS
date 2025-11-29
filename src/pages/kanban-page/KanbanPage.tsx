import { useGetAllFragranceMixStatuses } from 'hooks/config-hooks/ConfigHooks';
import { useGetFragranceMixes } from 'pages/FragrancePages/Hooks/FragranceMixHooks';
import styles from './KanbanPage.module.scss';

const KanbanPage = () => {
  const { fragranceMixStatuses = [] } = useGetAllFragranceMixStatuses();
  const { fragranceMixes = [] } = useGetFragranceMixes();

  return (
    <div>
      <div>
        <div className="actions-container">
          <h2>Kanban Page</h2>
        </div>
        <div className={styles.kanbanContainer}>
          {fragranceMixStatuses.map((status) => (
            <div
              key={status.fragranceMixStatusId}
              className={styles.kanbanColumn}
            >
              <div
                className={styles.kanbanColumnHeader}
                style={{
                  borderBottom: '1px solid black',
                  color: `#${status.colourHex}`,
                }}
              >
                <h3>{status.name}</h3>
              </div>

              <div className={styles.mixList}>
                {fragranceMixes
                  .filter(
                    (mix) =>
                      mix.status.fragranceMixStatusId ===
                      status.fragranceMixStatusId,
                  )
                  .map((mix) => (
                    <div key={mix.fragranceMixId} className={styles.mixCard}>
                      <p>{mix.name}</p>
                      <p>{mix.notes}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanPage;
