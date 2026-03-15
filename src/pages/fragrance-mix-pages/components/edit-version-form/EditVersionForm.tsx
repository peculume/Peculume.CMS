import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FragranceMix, FragranceOil } from 'types/fragranceTypes';
import { useGetFragranceOils } from 'pages/fragrance-oil-pages/hooks/FragranceOilHooks';
import {
  useUpdateFragranceMixVersion,
  useCreateFragranceMixVersion,
} from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';
import FragranceOilPicker from '../fragrance-oil-picker/FragranceOilPicker';
import styles from './EditVersionForm.module.scss';

type EditVersionFormProps = {
  fragranceMixId: number;
  version: FragranceMix['versions'][0];
};
const EditVersionForm: FC<EditVersionFormProps> = ({
  fragranceMixId,
  version,
}) => {
  const [notes, setNotes] = useState(version.notes);
  const [rating, setRating] = useState(version.rating);
  const [fragranceOils, setFragranceOils] = useState(version.fragranceOils);

  const [availableOils, setAvailableOils] = useState<FragranceOil[]>([]);

  const { fragranceOils: allFragranceOils } = useGetFragranceOils();

  const { updateFragranceMixVersion, updateFragranceMixVersionPending } =
    useUpdateFragranceMixVersion({
      onSuccess: (data) => {},
      onError: (error) => {},
    });

  const { createFragranceMixVersion, createFragranceMixVersionPending } =
    useCreateFragranceMixVersion({
      onSuccess: () => {},
      onError: () => {},
    });

  const handleDuplicate = () => {
    createFragranceMixVersion({
      fragranceMixId,
      notes: version.notes,
      rating: version.rating,
      oils: version.fragranceOils.map(({ fragranceOilId, mixRatio }) => ({
        fragranceOilId,
        mixRatio,
      })),
    });
  };

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

  const handleOnSubmit = () => {
    updateFragranceMixVersion({
      fragranceMixId: fragranceMixId,
      fragranceMixVersionId: version.fragranceMixVersionId,
      notes,
      rating,
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

      <div className={styles.notesGroup}>
        <label htmlFor={`rating-${version.fragranceMixVersionId}`}>
          Rating
        </label>
        <input
          id={`rating-${version.fragranceMixVersionId}`}
          type="number"
          value={rating}
          min={0}
          max={5}
          onChange={(e) => setRating(Number(e.target.value))}
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
        disabled={updateFragranceMixVersionPending}
        onClick={handleOnSubmit}
      >
        Update version
      </button>
      <button
        type="button"
        disabled={createFragranceMixVersionPending}
        onClick={handleDuplicate}
      >
        Duplicate version
      </button>
    </div>
  );
};

export default EditVersionForm;
