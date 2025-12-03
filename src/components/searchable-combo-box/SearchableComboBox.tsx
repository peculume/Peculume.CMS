import { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog } from 'radix-ui';
import styles from './SearchableComboBox.module.scss';

type Props<T> = {
  items: T[];
  value: string | null;
  onChange: (id: string, item?: T) => void;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => string;
  addNew?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
};

function SearchableComboBox<T>({
  items,
  value,
  onChange,
  getOptionLabel,
  getOptionValue,
  addNew,
  placeholder = 'Select...',
  disabled,
  label,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => items.find((it) => getOptionValue(it) === value),
    [items, value, getOptionValue],
  );

  // Autofocus the input when the dialog opens
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  const onCreateNew = (val: string) => {
    if (!addNew) return;
    addNew(val);
    setOpen(false);
    setSearch('');
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((it) =>
      getOptionLabel(it).toLowerCase().includes(term),
    );
  }, [items, search, getOptionLabel]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setSearch('');
        }
      }}
    >
      <div className={styles.container} data-open={open || undefined}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            ref={buttonRef}
            className={styles.button}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={label}
            disabled={disabled}
          >
            <span className={styles.buttonText}>
              {selected ? getOptionLabel(selected) : placeholder}
            </span>
            <svg
              className={styles.chevron}
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M5.5 7.5l4.5 4 4.5-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className={styles.backdrop} />
          <Dialog.Content
            className={styles.modal}
            aria-label={label || 'Select option'}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{label || 'Select'}</div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className={styles.closeBtn}
                  aria-label="Close"
                >
                  ×
                </button>
              </Dialog.Close>
            </div>

            <div className={styles.searchRow}>
              <input
                ref={inputRef}
                className={styles.searchInput}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search"
              />
            </div>

            <ul
              role="listbox"
              aria-label={label || 'Options'}
              className={styles.list}
            >
              {filteredItems.length === 0 && (
                <>
                  <li className={styles.empty}>No results</li>
                  {addNew && search.trim().length > 0 && (
                    <li>
                      <button
                        className={`btn primary ${styles.createNewBtn}`}
                        onClick={() => onCreateNew(search)}
                      >
                        Create "{search}"
                      </button>
                    </li>
                  )}
                </>
              )}

              {filteredItems.map((it) => {
                const id = getOptionValue(it);
                const isSelected = id === value;
                return (
                  <li
                    key={id}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={0}
                    onClick={() => {
                      onChange(id, it);
                      setOpen(false);
                      requestAnimationFrame(() => buttonRef.current?.focus());
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onChange(id, it);
                        setOpen(false);
                        requestAnimationFrame(() => buttonRef.current?.focus());
                      }
                    }}
                    className={`${styles.option} ${
                      isSelected ? styles.optionSelected : ''
                    }`}
                  >
                    {getOptionLabel(it)}
                  </li>
                );
              })}
            </ul>

            <div className={styles.footer}>{'End'}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  );
}

export default SearchableComboBox;
