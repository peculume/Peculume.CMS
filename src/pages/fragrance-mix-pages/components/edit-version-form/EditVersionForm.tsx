import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  FragranceMix,
  FragranceMixVersionOil,
  FragranceOil,
} from 'types/fragranceTypes';
import { useGetFragranceOils } from 'pages/fragrance-oil-pages/hooks/FragranceOilHooks';
import styles from './EditVersionForm.module.scss';
import { useUpdateFragranceMixVersion } from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';

type EditVersionFormProps = {
  fragranceMixId: number;
  version: FragranceMix['versions'][0];
};
const EditVersionForm: FC<EditVersionFormProps> = ({
  fragranceMixId,
  version,
}) => {
  const [notes, setNotes] = useState(version.notes);
  const [fragranceOils, setFragranceOils] = useState(version.fragranceOils);

  const [availableOils, setAvailableOils] = useState<FragranceOil[]>([]);

  const { fragranceOils: allFragranceOils } = useGetFragranceOils();

  const { updateFragranceMixVersion, updateFragranceMixVersionPending } =
    useUpdateFragranceMixVersion({
      onSuccess: (data) => {},
      onError: (error) => {},
    });

  useEffect(() => {
    const filtered = allFragranceOils.filter(
      (oils) =>
        !fragranceOils.some((f) => f.fragranceOilId === oils.fragranceOilId),
    );
    setAvailableOils(filtered);
  }, [allFragranceOils]);

  const handleOilRationChange = (fragranceOilId: number, newRation: string) => {
    const newRationNumber = Number(newRation);

    setFragranceOils((prev) =>
      prev.map((mix) => ({
        ...mix,
        mixRatio:
          mix.fragranceOilId === fragranceOilId
            ? newRationNumber
            : mix.mixRatio,
      })),
    );
  };

  const handleOilSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selected = availableOils.find(
      (item) => item.fragranceOilId === selectedId,
    );
    if (selected) {
      setFragranceOils((prev) => [
        ...prev,
        {
          fragranceOilId: selected.fragranceOilId,
          name: selected.name,
          mixRatio: 0,
        },
      ]);
      setAvailableOils((prev) =>
        prev.filter((item) => item.fragranceOilId !== selectedId),
      );
    }
    e.target.selectedIndex = 0;
  };

  const handleRemoveItem = (itemToRemove: FragranceMixVersionOil) => {
    setFragranceOils((prev) =>
      prev.filter(
        (item) => item.fragranceOilId !== itemToRemove.fragranceOilId,
      ),
    );
    setAvailableOils((prev) => [
      ...prev,
      allFragranceOils.find(
        (item) => item.fragranceOilId === itemToRemove.fragranceOilId,
      )!,
    ]);
  };

  const handleOnSubmit = () => {
    updateFragranceMixVersion({
      fragranceMixId: fragranceMixId,
      fragranceMixVersionId: version.fragranceMixVersionId,
      notes: notes,
      oils: fragranceOils,
    });
  };

  return (
    <div className={styles.versionCard}>
      <div className={styles.versionHeader}>
        <span className={styles.versionTitle}>Version {version.version}</span>
        <span className={styles.versionDate}>
          {format(new Date(version.createdAt), 'dd MMM yyyy HH:mm')}
        </span>
      </div>

      <div className={styles.notesGroup}>
        <label htmlFor={`notes-${version.fragranceMixVersionId}`}>Notes</label>
        <input
          id={`notes-${version.fragranceMixVersionId}`}
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className={styles.oilsSection}>
        <p className={styles.oilsHeader}>Fragrance oils</p>

        <div className={styles.oilList}>
          {fragranceOils.map((oil) => (
            <div key={oil.fragranceOilId} className={styles.oilLine}>
              <span className={styles.oilName}>{oil.name}</span>
              <input
                className={styles.oilInput}
                type="number"
                value={oil.mixRatio}
                onChange={(e) =>
                  handleOilRationChange(oil.fragranceOilId, e.target.value)
                }
              />
              <button
                type="button"
                className={styles.removeOilButton}
                onClick={() => handleRemoveItem(oil)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className={styles.addOilRow}>
          <label
            className={styles.addOilLabel}
            htmlFor={`add-oil-${version.fragranceMixVersionId}`}
          >
            Add oil
          </label>
          <select
            id={`add-oil-${version.fragranceMixVersionId}`}
            className={styles.addOilSelect}
            onChange={handleOilSelect}
          >
            <option value="">Select an oil...</option>
            {availableOils.map((item) => (
              <option key={item.fragranceOilId} value={item.fragranceOilId}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        disabled={updateFragranceMixVersionPending}
        onClick={handleOnSubmit}
      >
        Update version
      </button>
    </div>
  );
};

export default EditVersionForm;
