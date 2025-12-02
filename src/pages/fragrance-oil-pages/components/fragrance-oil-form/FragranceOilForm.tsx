import { FC, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiError } from 'types/productTypes';
import {
  FragranceOil,
  FragranceOilCategory,
  FragranceOilType,
} from 'types/fragranceTypes';
import {
  useCreateFragranceOil,
  useGetFragranceOilCategories,
  useGetFragranceOilTypes,
  useUpdateFragranceOil,
} from 'pages/fragrance-oil-pages/hooks/FragranceOilHooks';
import CreateFragranceOilCategoryModal from '../create-fragrance-oil-category-modal/CreateFragranceOilCategoryModal';
import { SearchableComboBox } from 'components';

type FragranceOilFormProps = {
  fragranceOil?: FragranceOil;
};

const FragranceOilForm: FC<FragranceOilFormProps> = ({ fragranceOil }) => {
  const navigate = useNavigate();

  const [name, setName] = useState(fragranceOil?.name ?? '');
  const [brand, setBrand] = useState(fragranceOil?.brand ?? '');
  const [oilCategories, setOilCategories] = useState<FragranceOilCategory[]>(
    fragranceOil?.categories ?? [],
  );
  const [oilType, setOilType] = useState<FragranceOilType | null>(
    fragranceOil?.type ?? null,
  );
  const [notes, setNotes] = useState(fragranceOil?.notes ?? '');

  const [availableCategories, setAvailableCategories] = useState<
    FragranceOilCategory[]
  >([]);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    fragranceOilCategories: dataFragranceOilCategories,
    isFragranceOilCategoriesLoading,
  } = useGetFragranceOilCategories();
  const { fragranceOilTypes, isFragranceOilTypesLoading } =
    useGetFragranceOilTypes();

  const { createFragranceOil, createFragranceOilPending } =
    useCreateFragranceOil({
      onSuccess: (fragranceOil) => {
        setErrorMessage('');
        navigate(`/fragrance-oils`);
      },
      onError: (error: ApiError) => {
        setErrorMessage(error.message);
      },
    });

  const { updateFragranceOil, updateFragranceOilPending } =
    useUpdateFragranceOil({
      onSuccess: (product) => {
        setErrorMessage('');
      },
      onError: (error: ApiError) => {
        setErrorMessage(error.message);
      },
    });

  useEffect(() => {
    const filtered = dataFragranceOilCategories.filter(
      (categories) =>
        !oilCategories.some(
          (c) => c.fragranceOilCategoryId === categories.fragranceOilCategoryId,
        ),
    );
    setAvailableCategories(filtered);
  }, [dataFragranceOilCategories]);

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = Number(e.target.value);
    const selectedCategory = availableCategories.find(
      (category) => category.fragranceOilCategoryId === selectedCategoryId,
    );
    if (selectedCategory) {
      handleSelectCategories([selectedCategory]);
    }
    e.target.selectedIndex = 0;
  };

  const handleSelectCategories = (categories: FragranceOilCategory[]) => {
    setOilCategories((prev) => [...prev, ...categories]);
    setAvailableCategories((prev) =>
      prev.filter(
        (category) =>
          !categories.some(
            (c) => category.fragranceOilCategoryId === c.fragranceOilCategoryId,
          ),
      ),
    );
  };

  const handleRemoveCategory = (categoryToRemove: FragranceOilCategory) => {
    setOilCategories((prev) =>
      prev.filter(
        (category) =>
          category.fragranceOilCategoryId !==
          categoryToRemove.fragranceOilCategoryId,
      ),
    );
    setAvailableCategories((prev) => [...prev, categoryToRemove]);
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!oilType) {
      setErrorMessage('Please select a product type');
      return;
    }

    if (fragranceOil) {
      updateFragranceOil({
        fragranceOilId: fragranceOil.fragranceOilId,
        name,
        brand,
        categoryIds: oilCategories.map((cat) => cat.fragranceOilCategoryId),
        typeId: oilType.fragranceOilTypeId,
        notes,
        baseNotesIds: [],
        heartNotesIds: [],
        topNotesIds: [],
      });
    } else {
      createFragranceOil({
        name,
        brand,
        categoryIds: oilCategories.map((cat) => cat.fragranceOilCategoryId),
        typeId: oilType.fragranceOilTypeId,
        notes,
        baseNotesIds: [],
        heartNotesIds: [],
        topNotesIds: [],
      });
    }
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
      <div className="formGroup">
        <label htmlFor="brand">Brand</label>
        <input
          id="brand"
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
      </div>
      {!isFragranceOilTypesLoading && (
        <div className="formGroup">
          <label htmlFor="type">Type</label>
          <SearchableComboBox<FragranceOilType>
            items={fragranceOilTypes}
            onChange={(item) => {
              setOilType(
                fragranceOilTypes.find(
                  ({ fragranceOilTypeId }) =>
                    fragranceOilTypeId.toString() === item,
                ) ?? null,
              );
            }}
            getOptionLabel={(e) => e.name}
            getOptionValue={(e) => e.fragranceOilTypeId.toString()}
            placeholder="Select a type..."
            label="Type"
            value={oilType?.fragranceOilTypeId.toString() ?? null}
          />
        </div>
      )}
      <div className="formGroup">
        <label htmlFor="categories">Categories</label>
        <div className="selector">
          <SearchableComboBox<FragranceOilCategory>
            items={availableCategories}
            onChange={(item) => {
              const selectedCategory = availableCategories.find(
                (category) =>
                  category.fragranceOilCategoryId.toString() === item,
              );
              if (selectedCategory) {
                handleSelectCategories([selectedCategory]);
              }
            }}
            getOptionLabel={(e) => e.name}
            getOptionValue={(e) => e.fragranceOilCategoryId.toString()}
            placeholder="Select a category..."
            label="Category"
            value={null}
          />
          <CreateFragranceOilCategoryModal
            onItemsAddedSuccessfully={handleSelectCategories}
          />
        </div>
        <div className="selected">
          {oilCategories.map((category) => (
            <div key={category.fragranceOilCategoryId} className="item">
              {category.name}
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveCategory(category)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
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
            disabled={createFragranceOilPending || updateFragranceOilPending}
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </form>
  );
};

export default FragranceOilForm;
