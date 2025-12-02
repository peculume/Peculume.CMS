import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => items.find((it) => getOptionValue(it) === value),
    [items, value, getOptionValue],
  );

  // Close on Escape (also restores focus to the button)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Body scroll lock while modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Autofocus the input when the modal mounts
  useEffect(() => {
    if (open) {
      // small timeout to allow portal to mount
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

  const modal = open
    ? createPortal(
        <div
          className={styles.modalRoot}
          role="dialog"
          aria-modal="true"
          aria-label={label || 'Select option'}
        >
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div className={styles.modal} role="document">
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{label || 'Select'}</div>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label="Close"
                onClick={() => {
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
              >
                ×
              </button>
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
              ref={listRef}
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

              <div ref={sentinelRef} className={styles.sentinel} />
            </ul>

            <div className={styles.footer}>{'End'}</div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div
      ref={rootRef}
      className={styles.container}
      data-open={open || undefined}
    >
      <button
        type="button"
        ref={buttonRef}
        className={styles.button}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
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
      {modal}
    </div>
  );
}

export default SearchableComboBox;
