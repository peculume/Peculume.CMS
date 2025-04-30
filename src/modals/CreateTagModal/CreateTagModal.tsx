import { useState } from "react";
import { Dialog } from "radix-ui";
import { useCreateTag, useGetTags } from "hooks/TagHooks/TagHooks";
import styles from "./CreateTagModal.module.scss";

const CreateTagModal = () => {

  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");

  const { tags } = useGetTags();
  const { createTag } = useCreateTag({
    onSuccess: () => {
      setTag("");
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const trimmedTag = tag.trim();
  const isDuplicate =
    !!tags?.some(t => t.name.toLowerCase() === trimmedTag.toLowerCase());

  const isInvalid = trimmedTag.length === 0 || isDuplicate;

  const handleSubmit = () => {
    setError("");
    createTag(tag);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} >
      <Dialog.Trigger asChild>
        <button>Create tag</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>Create tag</Dialog.Title>
          <Dialog.Description className={styles.dialogDescription}>
            Create additional tags to assign to products
          </Dialog.Description>
          <div className="formGroup">
            <label className="Label" htmlFor="tag">
              Tag
            </label>
            <input className="Input" id="tag" value={tag} onChange={(e) => setTag(e.target.value)} />
            {isDuplicate && <p className="error">That tag already exists.</p>}
            {error && <p className="error">{error}</p>}
          </div>
          <div
            style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}
          >
            <Dialog.Close asChild>
              <button disabled={isInvalid || isDuplicate} onClick={handleSubmit}>Create</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateTagModal;