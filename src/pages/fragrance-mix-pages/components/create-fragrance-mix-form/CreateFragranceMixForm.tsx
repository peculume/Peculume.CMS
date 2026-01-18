import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiError } from 'types/productTypes';
import {
  FragranceCategory,
  FragranceMixVersionOil,
} from 'types/fragranceTypes';
import { useCreateFragranceMix } from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';
import { CategoryPicker } from 'components';
import FragranceOilPicker from '../fragrance-oil-picker/FragranceOilPicker';

const CreateFragranceMixForm: FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [fragranceOils, setFragranceOils] = useState<FragranceMixVersionOil[]>(
    [],
  );
  const [oilCategories, setOilCategories] = useState<FragranceCategory[]>([]);

  const [errorMessage, setErrorMessage] = useState('');

  const { createFragranceMix, createFragranceMixPending } =
    useCreateFragranceMix({
      onSuccess: () => {
        setErrorMessage('');
        navigate(`/fragrance-mixes`);
      },
      onError: (error: ApiError) => {
        setErrorMessage(error.message);
      },
    });

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createFragranceMix({
      name,
      categoryIds: oilCategories.map(({ categoryId }) => categoryId),
      notes,
      oils: fragranceOils.map((oil) => ({
        fragranceOilId: oil.fragranceOilId,
        mixRatio: oil.mixRatio,
      })),
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
      <FragranceOilPicker
        selectedOils={fragranceOils}
        setSelectedOils={setFragranceOils}
        canCreate={true}
      />
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
            disabled={createFragranceMixPending}
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </form>
  );
};

export default CreateFragranceMixForm;
