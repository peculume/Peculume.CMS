import { FC, useState } from 'react';
import { Dialog } from 'radix-ui';
import FragranceOilForm from 'pages/fragrance-oil-pages/components/fragrance-oil-form/FragranceOilForm';
import { FragranceOil } from 'types/fragranceTypes';

type CreateFragranceOilModalProps = {
  onCreate: (newOil: FragranceOil) => void;
};

const CreateFragranceOilModal: FC<CreateFragranceOilModalProps> = ({
  onCreate,
}) => {
  const [open, setOpen] = useState(false);

  const handleOnCreate = (newOil: FragranceOil) => {
    onCreate(newOil);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button>Create oil</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialogOverlay" />
        <Dialog.Content className="dialogContent">
          <Dialog.Title className="dialogTitle">
            Create fragrance oil
          </Dialog.Title>
          <Dialog.Description className="dialogDescription">
            Create a new fragrance oil
          </Dialog.Description>
          <FragranceOilForm onCreate={handleOnCreate} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateFragranceOilModal;
