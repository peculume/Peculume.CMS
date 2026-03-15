import { FormEvent, useState } from 'react';
import { useCreateLore, useGetLoreTypes } from 'hooks/lore-hooks/LoreHooks';

const LoreForm = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [loreTypeId, setLoreTypeId] = useState<number>(-1);

  const [errorMessage, setErrorMessage] = useState('');

  const { createLore, createLorePending } = useCreateLore({
    onSuccess: () => {},
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const { loreTypes } = useGetLoreTypes();

  const isFormValid = () => {
    return (
      name.trim() !== '' &&
      slug.trim() !== '' &&
      description.trim() !== '' &&
      loreTypeId > 0
    );
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid()) {
      setErrorMessage('All fields are required.');
      return;
    }

    setErrorMessage('');

    createLore({
      name,
      slug,
      description,
      loreTypeId,
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
        <label htmlFor="slug">Slug</label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>
      <div className="formGroup">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="formGroup">
        <label htmlFor="loreType">Lore Type</label>
        <select
          id="loreType"
          value={loreTypeId}
          onChange={(e) => setLoreTypeId(Number(e.target.value))}
        >
          <option value="">Select a lore type</option>
          {loreTypes.map((type) => (
            <option key={type.loreTypeId} value={type.loreTypeId}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div className="buttonsContainer">
          <input
            className="submitButton"
            type="submit"
            value="Save"
            disabled={createLorePending}
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </form>
  );
};

export default LoreForm;
