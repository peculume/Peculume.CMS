import { FC, FormEvent, useState } from 'react';
import { ApiError } from 'types/productTypes';
import {
  FragranceCategory,
  FragranceMix,
  FragranceMixStatus,
} from 'types/fragranceTypes';
import { useUpdateFragranceMix } from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';
import EditVersionForm from '../edit-version-form/EditVersionForm';
import styles from './EditFragranceMixForm.module.scss';
import { CategoryPicker } from 'components';

type EditFragranceMixFormProps = {
  fragranceMix: FragranceMix;
  status: FragranceMixStatus;
};

const EditFragranceMixForm: FC<EditFragranceMixFormProps> = ({
  fragranceMix,
  status,
}) => {
  const [name, setName] = useState(fragranceMix.name);
  const [notes, setNotes] = useState(fragranceMix.notes);
  const [oilCategories, setOilCategories] = useState<FragranceCategory[]>(
    fragranceMix.categories,
  );

  const [errorMessage, setErrorMessage] = useState('');

  const { updateFragranceMix, updateFragranceMixPending } =
    useUpdateFragranceMix({
      onSuccess: () => {
        setErrorMessage('');
      },
      onError: (error: ApiError) => {
        setErrorMessage(error.message);
      },
    });

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateFragranceMix({
      fragranceMixId: fragranceMix.fragranceMixId,
      name,
      categoryIds: oilCategories.map(({ categoryId }) => categoryId),
      notes,
      statusId: status.fragranceMixStatusId,
    });
  };

  return (
    <form className="form" onSubmit={handleOnSubmit}>
      <div className="formGroup">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <CategoryPicker
        selectedCategories={oilCategories}
        setSelectedCategories={setOilCategories}
        canCreate
      />
      <div className="formGroup">
        <label htmlFor="notes">Notes</label>
        <input
          id="notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div>
        <div className="buttonsContainer">
          <input
            className="submitButton"
            type="submit"
            value="Save"
            disabled={updateFragranceMixPending}
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
      <div className={styles.versionsSection}>
        <div className={styles.versionsHeader}>
          <h3>Versions</h3>
        </div>
        <div className={styles.versionsContainer}>
          {fragranceMix.versions.map((version) => (
            <EditVersionForm
              key={version.fragranceMixVersionId}
              fragranceMixId={fragranceMix.fragranceMixId}
              version={version}
            />
          ))}
          <button
            type="button"
            className={styles.addVersionCard}
            onClick={() => console.log('TODO: add version')}
          >
            +
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditFragranceMixForm;
