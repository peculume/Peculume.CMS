import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { useCreateFragranceMixStatus } from 'hooks/config-hooks/ConfigHooks';

const isValidColourHex = (hex: string) => {
  const hexRegex = /^[0-9A-F]{6}$/i;
  return hexRegex.test(hex);
};

const CreateFragranceMixStatusModal = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [colourHex, setColourHex] = useState('');
  const [order, setOrder] = useState(0);
  const [error, setError] = useState('');

  const { createFragranceMixStatus, createFragranceMixStatusPending } =
    useCreateFragranceMixStatus({
      onSuccess: () => {
        setOpen(false);
        setStatus('');
        setColourHex('');
        setOrder(0);
      },
      onError: (error) => {
        setError(error.message);
      },
    });

  const trimmedStatus = status.trim();
  const isInvalid =
    trimmedStatus.length === 0 || !isValidColourHex(colourHex) || order < 0;

  const handleSubmit = () => {
    setError('');
    createFragranceMixStatus({ name: trimmedStatus, colourHex, order });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button>Create status</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialogOverlay" />
        <Dialog.Content className="dialogContent">
          <Dialog.Title className="dialogTitle">Create status</Dialog.Title>
          <Dialog.Description className="dialogDescription">
            Create a new status to organize your fragrance mixes.
          </Dialog.Description>
          <div className="form">
            <div className="formGroup">
              <label className="Label" htmlFor="status">
                Status
              </label>
              <input
                className="Input"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <label className="Label" htmlFor="colourHex">
                Colour Hex
              </label>
              <input
                className="Input"
                id="colourHex"
                value={colourHex}
                onChange={(e) => setColourHex(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <label className="Label" htmlFor="order">
                Order
              </label>
              <input
                className="Input"
                id="order"
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>
            {error && <p className="error">{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                disabled={isInvalid || createFragranceMixStatusPending}
                onClick={handleSubmit}
              >
                Create
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateFragranceMixStatusModal;
