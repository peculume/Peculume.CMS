import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { useGetAllFragranceMixStatuses } from 'hooks/config-hooks/ConfigHooks';
import {
  useGetFragranceMixes,
  useUpdateFragranceMixStatus,
} from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';
import { CreateKanbanStatusModal } from 'components';
import styles from './KanbanPage.module.scss';

const KanbanPage = () => {
  const { fragranceMixStatuses = [] } = useGetAllFragranceMixStatuses();
  const { fragranceMixes = [] } = useGetFragranceMixes();

  const [mixesByStatus, setMixesByStatus] = useState<
    Record<number, typeof fragranceMixes>
  >({});

  const { updateFragranceMixStatus, updateFragranceMixStatusPending } =
    useUpdateFragranceMixStatus({
      onSuccess: () => {},
      onError: (error) => {
        console.error(error);
      },
    });

  useEffect(() => {
    const grouped: Record<number, typeof fragranceMixes> = {};
    fragranceMixStatuses.forEach((s) => {
      grouped[s.fragranceMixStatusId] = [];
    });
    fragranceMixes.forEach((mix) => {
      const statusId = mix.status.fragranceMixStatusId;
      if (!grouped[statusId]) grouped[statusId] = [];
      grouped[statusId].push(mix);
    });
    setMixesByStatus(grouped);
  }, [fragranceMixes, fragranceMixStatuses]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    const sourceStatusId = Number(source.droppableId);
    const destStatusId = Number(destination.droppableId);
    if (sourceStatusId === destStatusId && source.index === destination.index)
      return;

    const mixId = Number(draggableId);

    // optimistic update
    setMixesByStatus((prev) => {
      const next = structuredClone(prev) as typeof prev;

      const sourceList = [...next[sourceStatusId]];
      const [moved] = sourceList.splice(source.index, 1);
      next[sourceStatusId] = sourceList;

      const destList = [...(next[destStatusId] ?? [])];
      const updatedMix = {
        ...moved,
        status: { ...moved.status, fragranceMixStatusId: destStatusId },
      };
      destList.splice(destination.index, 0, updatedMix);
      next[destStatusId] = destList;

      return next;
    });

    try {
      updateFragranceMixStatus({
        fragranceMixId: mixId,
        fragranceMixStatusId: destStatusId,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="actions-container">
        <h2>Kanban</h2>
        <div>
          <CreateKanbanStatusModal />
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.kanbanContainer}>
          {fragranceMixStatuses.map((status) => (
            <Droppable
              key={status.fragranceMixStatusId}
              droppableId={String(status.fragranceMixStatusId)}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={styles.kanbanColumn}
                >
                  <div
                    className={styles.kanbanColumnHeader}
                    style={{
                      borderBottom: '1px solid black',
                      background: `#${status.colourHex}`,
                      color: '#fff',
                      borderRadius: '4px 4px 0px 0px',
                    }}
                  >
                    <h3>{status.name}</h3>
                  </div>

                  <div className={styles.mixList}>
                    {(mixesByStatus[status.fragranceMixStatusId] ?? []).map(
                      (mix, index) => (
                        <Draggable
                          key={mix.fragranceMixId}
                          draggableId={String(mix.fragranceMixId)}
                          index={index}
                          isDragDisabled={updateFragranceMixStatusPending}
                        >
                          {(dragProvided) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={styles.mixCard}
                            >
                              <p>{mix.name}</p>
                              <p>{mix.notes}</p>
                            </div>
                          )}
                        </Draggable>
                      ),
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanPage;
