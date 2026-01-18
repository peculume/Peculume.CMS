import { FC, useEffect, useState } from 'react';
import { FragranceMixVersionOil, FragranceOil } from 'types/fragranceTypes';
import { useGetFragranceOils } from 'pages/fragrance-oil-pages/hooks/FragranceOilHooks';
import SearchableComboBox from 'components/searchable-combo-box/SearchableComboBox';
import CreateFragranceOilModal from 'components/create-fragrance-oil-modal/CreateFragranceOilModal';

import styles from './FragranceOilPicker.module.scss';

type FragranceOilPickerProps = {
  selectedOils: FragranceMixVersionOil[];
  setSelectedOils: React.Dispatch<
    React.SetStateAction<FragranceMixVersionOil[]>
  >;
  canCreate?: boolean;
};

const FragranceOilPicker: FC<FragranceOilPickerProps> = ({
  selectedOils,
  setSelectedOils,
  canCreate,
}) => {
  const [availableFragranceOils, setAvailableFragranceOils] = useState<
    FragranceOil[]
  >([]);

  const { fragranceOils: dataFragranceOils } = useGetFragranceOils();

  useEffect(() => {
    const filtered = dataFragranceOils.filter(
      (oils) =>
        !selectedOils.some((f) => f.fragranceOilId === oils.fragranceOilId),
    );
    setAvailableFragranceOils(filtered);
  }, [dataFragranceOils]);

  const handleSelectOil = (oils: FragranceMixVersionOil[]) => {
    setSelectedOils((prev) => [...prev, ...oils]);
    setAvailableFragranceOils((prev) =>
      prev.filter(
        (oil) => !oils.some((c) => oil.fragranceOilId === c.fragranceOilId),
      ),
    );
  };

  const handleOilSelect = (fragranceOil: FragranceOil) => {
    setSelectedOils((prev) => [
      ...prev,
      {
        fragranceOilId: fragranceOil.fragranceOilId,
        name: fragranceOil.name,
        mixRatio: 0,
      },
    ]);
    setAvailableFragranceOils((prev) =>
      prev.filter(
        (item) => item.fragranceOilId !== fragranceOil.fragranceOilId,
      ),
    );
  };

  const handleRemoveOil = (itemToRemove: FragranceMixVersionOil) => {
    setSelectedOils((prev) =>
      prev.filter(
        (item) => item.fragranceOilId !== itemToRemove.fragranceOilId,
      ),
    );
    setAvailableFragranceOils((prev) => [
      ...prev,
      dataFragranceOils.find(
        (item) => item.fragranceOilId === itemToRemove.fragranceOilId,
      )!,
    ]);
  };

  const onCreateFragranceOil = (newOil: FragranceOil) => {
    setSelectedOils((prev) => [
      ...prev,
      {
        fragranceOilId: newOil.fragranceOilId,
        name: newOil.name,
        mixRatio: 0,
      },
    ]);
  };

  const updateMixRation = (id: number, value: string) => {
    setSelectedOils((prev) =>
      prev.map((item) =>
        item.fragranceOilId === id
          ? { ...item, mixRatio: Number(value) }
          : item,
      ),
    );
  };

  const handleRemoveItem = (itemToRemove: FragranceMixVersionOil) => {
    setSelectedOils((prev) =>
      prev.filter(
        (item) => item.fragranceOilId !== itemToRemove.fragranceOilId,
      ),
    );
    setAvailableFragranceOils((prev) => [
      ...prev,
      dataFragranceOils.find(
        (item) => item.fragranceOilId === itemToRemove.fragranceOilId,
      )!,
    ]);
  };

  return (
    <div className="formGroup">
      <label>Fragrance Oils</label>

      <div className="selector">
        <SearchableComboBox<FragranceOil>
          items={availableFragranceOils}
          onChange={(id) => {
            const selectedItem = availableFragranceOils.find(
              (item) => item.fragranceOilId.toString() === id,
            );
            if (selectedItem) {
              handleOilSelect(selectedItem);
            }
          }}
          getOptionLabel={(e) => e.name}
          getOptionValue={(e) => e.fragranceOilId.toString()}
          placeholder="Select an oil..."
          label="fragrance-oils"
          value={null}
        />
        {canCreate && (
          <CreateFragranceOilModal onCreate={onCreateFragranceOil} />
        )}
      </div>

      <div className={styles.selectedOilsContainer}>
        {selectedOils.map((item) => (
          <div
            key={item.fragranceOilId}
            className={styles.selectedOilItemContainer}
          >
            <p>{item.name}</p>
            <input
              type="text"
              value={item.mixRatio}
              onChange={(e) =>
                updateMixRation(item.fragranceOilId, e.target.value)
              }
            />
            %
            <button type="button" onClick={() => handleRemoveItem(item)}>
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FragranceOilPicker;
