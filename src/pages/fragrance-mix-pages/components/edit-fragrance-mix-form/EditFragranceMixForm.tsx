import { FC, FormEvent, useState } from 'react';
import { ApiError } from 'types/productTypes';
import { FragranceMix, FragranceMixStatus } from 'types/fragranceTypes';
import { useUpdateFragranceMix } from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';

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

export default EditFragranceMixForm;
