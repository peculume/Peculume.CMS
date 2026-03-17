import { FC } from 'react';
import { FragranceCategory } from 'types/fragranceTypes';
import { CreateFragranceCategoryModal, SearchableComboBox } from 'components';
import { useGetFragranceCategories } from 'pages/fragrance-oil-pages/hooks/FragranceOilHooks';

type CategoryPickerProps = {
  selectedCategories: FragranceCategory[];
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<FragranceCategory[]>
  >;
  canCreate?: boolean;
};

const CategoryPicker: FC<CategoryPickerProps> = ({
  selectedCategories,
  setSelectedCategories,
  canCreate = false,
}) => {
  const { fragranceOilCategories } = useGetFragranceCategories();

  const availableCategories = fragranceOilCategories.filter(
    (category) =>
      !selectedCategories.some((c) => c.categoryId === category.categoryId),
  );

  const handleSelectCategories = (categories: FragranceCategory[]) => {
    setSelectedCategories((prev) => [...prev, ...categories]);
  };

  const handleRemoveCategory = (categoryToRemove: FragranceCategory) => {
    setSelectedCategories((prev) =>
      prev.filter(
        (category) => category.categoryId !== categoryToRemove.categoryId,
      ),
    );
  };

  return (
    <div className="formGroup">
      <label>Categories</label>

      <div className="selector">
        <SearchableComboBox<FragranceCategory>
          items={availableCategories}
          onChange={(id) => {
            const selectedCategory = availableCategories.find(
              (category) => category.categoryId.toString() === id,
            );
            if (selectedCategory) {
              handleSelectCategories([selectedCategory]);
            }
          }}
          getOptionLabel={(e) => e.name}
          getOptionValue={(e) => e.categoryId.toString()}
          placeholder="Select a category..."
          label="categories"
          value={null}
        />

        {canCreate && (
          <CreateFragranceCategoryModal
            onItemsAddedSuccessfully={handleSelectCategories}
          />
        )}
      </div>

      <div className="selected">
        {selectedCategories.map((category) => (
          <div key={category.categoryId} className="item">
            {category.name}
            <button
              type="button"
              className="remove-button"
              onClick={() => handleRemoveCategory(category)}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPicker;
