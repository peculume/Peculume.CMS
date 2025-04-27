import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "radix-ui";
import { API_BASE_URL, BUILD_TIME_API_KEY } from "api/config";
import styles from "./CreateTagModal.module.scss";
import { ApiError, Tag } from "types/productTypes";

const CreateTagModal = () => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState("");

  const { mutate: createTag } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/tags/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
        },
        body: JSON.stringify({
          tagName: tag,
        }),
      });

      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw error;
      }

      return await response.json() as Tag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTags"] })
      setTag("");
    },
    onError: (error: ApiError) => {
      // setErrorMessage(error.message);
    }
  });

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
          </div>
          <div
            style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}
          >
            <Dialog.Close asChild>
              <button onClick={() => createTag()}>Create</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateTagModal;