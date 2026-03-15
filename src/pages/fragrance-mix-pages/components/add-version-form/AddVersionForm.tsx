import { FC, useState } from 'react';
import { FragranceMixVersionOil } from 'types/fragranceTypes';
import { useCreateFragranceMixVersion } from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';
import FragranceOilPicker from '../fragrance-oil-picker/FragranceOilPicker';
import styles from '../edit-version-form/EditVersionForm.module.scss';

type AddVersionFormProps = {
  fragranceMixId: number;
  onSuccess?: () => void;
};

const AddVersionForm: FC<AddVersionFormProps> = ({
  fragranceMixId,
  onSuccess,
}) => {
  const [notes, setNotes] = useState('');
  const [fragranceOils, setFragranceOils] = useState<FragranceMixVersionOil[]>(
    [],
  );

  const { createFragranceMixVersion, createFragranceMixVersionPending } =
    useCreateFragranceMixVersion({
      onSuccess: () => {
        setNotes('');
        setFragranceOils([]);
        onSuccess?.();
      },
      onError: () => {},
    });

  const handleOnSubmit = () => {
    createFragranceMixVersion({
      fragranceMixId,
      notes,
      oils: fragranceOils,
    });
  };

  return (
    <div className={styles.versionCard}>
      <div className={styles.notesGroup}>
        <label htmlFor={`add-version-notes-${fragranceMixId}`}>Notes</label>
        <input
          id={`add-version-notes-${fragranceMixId}`}
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className={styles.oilsSection}>
        <FragranceOilPicker
          selectedOils={fragranceOils}
          setSelectedOils={setFragranceOils}
          canCreate={false}
        />
      </div>

      <button
        type="button"
        disabled={createFragranceMixVersionPending}
        onClick={handleOnSubmit}
      >
        Add version
      </button>
    </div>
  );
};

export default AddVersionForm;
