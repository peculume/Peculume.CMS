import { FC, useState } from 'react';
import { Dialog } from 'radix-ui';
import { useGetMedia } from 'hooks/MediaHooks/MediaHooks';
import { Media } from 'types/productTypes';
import styles from './SelectMediaModal.module.scss';

type Props = {
  selectedMedia: Media[];
  onConfirm: (newMedia: Media[]) => void;
};

const SelectMediaModal: FC<Props> = ({ selectedMedia, onConfirm }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newlySelected, setNewlySelected] = useState<Set<number>>(new Set());

  const { media } = useGetMedia();

  const alreadySelectedIds = new Set(selectedMedia.map((m) => m.mediaId));

  const filtered = media.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggle = (item: Media) => {
    if (alreadySelectedIds.has(item.mediaId)) return;
    setNewlySelected((prev) => {
      const next = new Set(prev);
      next.has(item.mediaId) ? next.delete(item.mediaId) : next.add(item.mediaId);
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(media.filter((m) => newlySelected.has(m.mediaId)));
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setNewlySelected(new Set());
      setSearch('');
    }
    setOpen(isOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <input type="button" value="Select existing" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <div>
              <Dialog.Title className={styles.title}>Media Library</Dialog.Title>
              <Dialog.Description className={styles.description}>
                Click to select. <span className={styles.legendGreen}>Green</span> = already added.{' '}
                <span className={styles.legendBlue}>Blue</span> = newly selected.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className={styles.closeButton}>✕</button>
            </Dialog.Close>
          </div>

          <input
            className={styles.search}
            type="search"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          {filtered.length === 0 ? (
            <p className={styles.empty}>
              {search ? `No results for "${search}"` : 'No media found.'}
            </p>
          ) : (
            <div className={styles.grid}>
              {filtered.map((item) => {
                const isAlready = alreadySelectedIds.has(item.mediaId);
                const isNew = newlySelected.has(item.mediaId);
                return (
                  <button
                    key={item.mediaId}
                    type="button"
                    title={item.name}
                    className={`${styles.item} ${isAlready ? styles.alreadySelected : ''} ${isNew ? styles.newlySelected : ''}`}
                    onClick={() => handleToggle(item)}
                  >
                    <img src={item.url} alt={item.name} />
                    <span className={styles.itemName}>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className={styles.footer}>
            <Dialog.Close asChild>
              <button type="button">Cancel</button>
            </Dialog.Close>
            <button
              type="button"
              className={styles.confirmButton}
              onClick={handleConfirm}
              disabled={newlySelected.size === 0}
            >
              {newlySelected.size > 0 ? `Add ${newlySelected.size} image${newlySelected.size !== 1 ? 's' : ''}` : 'Add'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SelectMediaModal;
