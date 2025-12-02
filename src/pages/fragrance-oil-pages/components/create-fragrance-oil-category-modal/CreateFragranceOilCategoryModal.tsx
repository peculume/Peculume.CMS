import { FC, useState } from 'react';
import { Dialog } from 'radix-ui';
import { useCreateFragranceOilCategories } from 'pages/fragrance-oil-pages/hooks/FragranceOilHooks';
import { FragranceOilCategory } from 'types/fragranceTypes';

type CreateFragranceOilCategoryModalProps = {
  onItemsAddedSuccessfully: (items: FragranceOilCategory[]) => void;
};

const CreateFragranceOilCategoryModal: FC<
  CreateFragranceOilCategoryModalProps
> = ({ onItemsAddedSuccessfully }) => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const { createFragranceOilCategories } = useCreateFragranceOilCategories({
    onSuccess: (data) => {
      setCategory('');
      setError('');
      setOpen(false);
      onItemsAddedSuccessfully(data);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const trimmedCategory = category.trim();

  const isInvalid = trimmedCategory.length === 0;

  const handleSubmit = () => {
    setError('');
    createFragranceOilCategories({ names: [trimmedCategory] });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button>Create category</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialogOverlay" />
        <Dialog.Content className="dialogContent">
          <Dialog.Title className="dialogTitle">
            Create fragrance oil category
          </Dialog.Title>
          <Dialog.Description className="dialogDescription">
            Create additional fragrance oil categories to assign to fragrance
            oils
          </Dialog.Description>
          <div className="form">
            <div className="formGroup">
              <label className="Label" htmlFor="category">
                Category
              </label>
              <input
                className="Input"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              {error && <p className="error">{error}</p>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button disabled={isInvalid} onClick={handleSubmit}>
                Create
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateFragranceOilCategoryModal;
