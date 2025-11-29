import { FC, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiError } from 'types/productTypes';
import { FragranceMix } from 'types/fragranceTypes';
import { useGetFragranceOils } from '../Hooks/FragranceOilHooks';
import { useUpdateFragranceMix } from '../Hooks/FragranceMixHooks';

type FragranceMixFormProps = {
  fragranceMix: FragranceMix;
};

const UpdateFragranceMixForm: FC<FragranceMixFormProps> = ({
  fragranceMix,
}) => {
  const navigate = useNavigate();

  const [name, setName] = useState(fragranceMix?.name ?? '');
  const [notes, setNotes] = useState(fragranceMix?.notes ?? '');

  const [errorMessage, setErrorMessage] = useState('');

  const { fragranceOils: dataFragranceOils } = useGetFragranceOils();

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
      notes,
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
    </form>
  );
};

export default UpdateFragranceMixForm;
