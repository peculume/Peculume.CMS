import { FC, useEffect, useState } from 'react';
import { ApiError } from 'types/productTypes';
import {
  FragranceOil,
  FragranceCategory,
  FragranceOilType,
} from 'types/fragranceTypes';
import {
  useCreateFragranceOil,
  useGetFragranceCategories,
  useGetFragranceOilTypes,
  useUpdateFragranceOil,
} from 'pages/fragrance-oil-pages/hooks/FragranceOilHooks';
import { CategoryPicker, SearchableComboBox } from 'components';
import NotesSection from '../notes-section/NotesSection';

type FragranceOilFormProps = {
  fragranceOil?: FragranceOil;
  onCreate?: (newOil: FragranceOil) => void;
};

const FragranceOilForm: FC<FragranceOilFormProps> = ({
  fragranceOil,
  onCreate,
}) => {
  const [name, setName] = useState(fragranceOil?.name ?? '');
  const [brand, setBrand] = useState(fragranceOil?.brand ?? '');
  const [topNotes, setTopNotes] = useState(
    fragranceOil?.noteAssignments
      .filter((note) => note.layer === 'Top')
      .map(({ name }) => name)
      .join(', ') ?? '',
  );
  const [heartNotes, setHeartNotes] = useState(
    fragranceOil?.noteAssignments
      .filter((note) => note.layer === 'Heart')
      .map(({ name }) => name)
      .join(', ') ?? '',
  );
  const [baseNotes, setBaseNotes] = useState(
    fragranceOil?.noteAssignments
      .filter((note) => note.layer === 'Base')
      .map(({ name }) => name)
      .join(', ') ?? '',
  );
  const [oilCategories, setOilCategories] = useState<FragranceCategory[]>(
    fragranceOil?.categories ?? [],
  );
  const [oilType, setOilType] = useState<FragranceOilType | null>(
    fragranceOil?.type ?? null,
  );
  const [notes, setNotes] = useState(fragranceOil?.notes ?? '');

  const [availableCategories, setAvailableCategories] = useState<
    FragranceCategory[]
  >([]);
  const [errorMessage, setErrorMessage] = useState('');

  const { fragranceOilCategories: dataFragranceOilCategories } =
    useGetFragranceCategories();
  const { fragranceOilTypes, isFragranceOilTypesLoading } =
    useGetFragranceOilTypes();

  const { createFragranceOil, createFragranceOilPending } =
    useCreateFragranceOil({
      onSuccess: (fragranceOil) => {
        setErrorMessage('');
        // navigate(`/fragrance-oils`);
        onCreate?.(fragranceOil);
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
        !oilCategories.some((c) => c.categoryId === categories.categoryId),
    );
    setAvailableCategories(filtered);
  }, [dataFragranceOilCategories]);

  const handleSelectCategories = (categories: FragranceCategory[]) => {
    setOilCategories((prev) => [...prev, ...categories]);
    setAvailableCategories((prev) =>
      prev.filter(
        (category) =>
          !categories.some((c) => category.categoryId === c.categoryId),
      ),
    );
  };

  const handleRemoveCategory = (categoryToRemove: FragranceCategory) => {
    setOilCategories((prev) =>
      prev.filter(
        (category) => category.categoryId !== categoryToRemove.categoryId,
      ),
    );
    setAvailableCategories((prev) => [...prev, categoryToRemove]);
  };

  const handleOnSubmit = () => {
    if (!oilType) {
      setErrorMessage('Please select a product type');
      return;
    }

    if (fragranceOil) {
      updateFragranceOil({
        fragranceOilId: fragranceOil.fragranceOilId,
        name,
        brand,
        categoryIds: oilCategories.map((cat) => cat.categoryId),
        typeId: oilType.fragranceOilTypeId,
        notes,
        topNotes,
        baseNotes,
        heartNotes,
      });
    } else {
      createFragranceOil({
        name,
        brand,
        categoryIds: oilCategories.map((cat) => cat.categoryId),
        typeId: oilType.fragranceOilTypeId,
        notes,
        topNotes,
        baseNotes,
        heartNotes,
      });
    }
  };

  return (
    <div className="form">
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
      <NotesSection
        topNotes={topNotes}
        setTopNotes={setTopNotes}
        heartNotes={heartNotes}
        setHeartNotes={setHeartNotes}
        baseNotes={baseNotes}
        setBaseNotes={setBaseNotes}
      />
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
      <CategoryPicker
        selectedCategories={oilCategories}
        setSelectedCategories={setOilCategories}
        canCreate={true}
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
            onClick={handleOnSubmit}
            disabled={createFragranceOilPending || updateFragranceOilPending}
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default FragranceOilForm;
