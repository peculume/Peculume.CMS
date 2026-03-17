import { FC } from 'react';
import { FragranceMix } from 'types/fragranceTypes';
import { SearchableComboBox } from 'components';
import { useGetFragranceMixes } from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';

type FragranceMixPickerProps = {
  selected: FragranceMix[];
  setSelected: React.Dispatch<React.SetStateAction<FragranceMix[]>>;
  canCreate?: boolean;
};

const FragranceMixPicker: FC<FragranceMixPickerProps> = ({
  selected,
  setSelected,
  canCreate = false,
}) => {
  const { fragranceMixes } = useGetFragranceMixes();

  const available = fragranceMixes.filter(
    (mix) => !selected.some((s) => s.fragranceMixId === mix.fragranceMixId),
  );

  const handleSelect = (mixes: FragranceMix[]) => {
    setSelected((prev) => [...prev, ...mixes]);
  };

  const handleRemove = (mixToRemove: FragranceMix) => {
    setSelected((prev) =>
      prev.filter((mix) => mix.fragranceMixId !== mixToRemove.fragranceMixId),
    );
  };

  return (
    <div className="formGroup">
      <label>Fragrance mixes</label>

      <div className="selector">
        <SearchableComboBox<FragranceMix>
          items={available}
          onChange={(id) => {
            const selectedMix = available.find(
              (mix) => mix.fragranceMixId.toString() === id,
            );
            if (selectedMix) {
              handleSelect([selectedMix]);
            }
          }}
          getOptionLabel={(e) => e.name}
          getOptionValue={(e) => e.fragranceMixId.toString()}
          placeholder="Select a fragrance mix..."
          label="fragrance mixes"
          value={null}
        />

        {/* {canCreate && (
          <CreateFragranceCategoryModal
            onItemsAddedSuccessfully={handleSelectCategories}
          />
        )} */}
      </div>

      <div className="selected">
        {selected.map((mix) => (
          <div key={mix.fragranceMixId} className="item">
            {mix.name}
            <button
              type="button"
              className="remove-button"
              onClick={() => handleRemove(mix)}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FragranceMixPicker;
