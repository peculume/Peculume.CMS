import { FC, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiError } from 'types/productTypes';
import {
  FragranceMix,
  FragranceMixVersionOil,
  FragranceOil,
} from 'types/fragranceTypes';
import { useGetFragranceOils } from '../Hooks/FragranceOilHooks';
import { useCreateFragranceMix } from '../Hooks/FragranceMixHooks';

const FragranceMixForm: FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [fragranceOils, setFragranceOils] = useState<FragranceMixVersionOil[]>(
    [],
  );

  const [availableOils, setAvailableOils] = useState<FragranceOil[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const { fragranceOils: dataFragranceOils } = useGetFragranceOils();

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

  useEffect(() => {
    const filtered = dataFragranceOils.filter(
      (oils) =>
        !fragranceOils.some((f) => f.fragranceOilId === oils.fragranceOilId),
    );
    setAvailableOils(filtered);
  }, [dataFragranceOils]);

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
      prev.filter((item) => item.fragranceOilId !== item.fragranceOilId),
    );
    setAvailableOils((prev) => [
      ...prev,
      dataFragranceOils.find(
        (item) => item.fragranceOilId === itemToRemove.fragranceOilId,
      )!,
    ]);
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createFragranceMix({
      name,
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
      <div className="formGroup">
        <label htmlFor="oils">Oils</label>
        <div className="selector">
          <select id="oils" onChange={handleOilSelect}>
            <option value="">Select an oil...</option>
            {availableOils.map((item) => (
              <option key={item.fragranceOilId} value={item.fragranceOilId}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="selected">
          {fragranceOils.map((item) => (
            <div key={item.fragranceOilId} className="item">
              {item.name}
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveItem(item)}
              >
                x
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
            disabled={createFragranceMixPending}
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </form>
  );
};

export default FragranceMixForm;
