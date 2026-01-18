import { FC, useState } from 'react';
import { Dialog } from 'radix-ui';

type AreYouSureModalProps = {
  text: string;
  description: string;
  onConfirm: () => void;
};

const AreYouSureModal: FC<AreYouSureModalProps> = ({
  text,
  description,
  onConfirm,
}) => {
  const [open, setOpen] = useState(false);

  const handleOnConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleOnCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <p>{text}</p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialogOverlay" />
        <Dialog.Content className="dialogContent">
          <Dialog.Title className="dialogTitle">Are you sure?</Dialog.Title>
          <Dialog.Description className="dialogDescription">
            {description}
          </Dialog.Description>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={handleOnCancel}>Cancel</button>
            <button onClick={handleOnConfirm}>Confirm</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AreYouSureModal;
