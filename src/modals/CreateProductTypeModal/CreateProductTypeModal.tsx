import { useState } from "react";
import { Dialog } from "radix-ui";
import { useCreateProductType, useGetProductTypes } from "hooks/ProductTypeHooks/ProductTypeHooks";
import styles from "./CreateProductTypeModal.module.scss";

const CreateProductTypeModal = () => {

  const [open, setOpen] = useState(false);
  const [productTypeName, setProductTypeName] = useState("");
  const [productTypeSlug, setProductTypeSlug] = useState("");
  const [error, setError] = useState("");

  const { productTypes } = useGetProductTypes();
  const { createProductType } = useCreateProductType({
    onSuccess: () => {
      setProductTypeName("");
      setProductTypeSlug("");
      setError("");
      setOpen(false);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const trimmedProductType = productTypeName.trim();
  const trimmedProductTypeSlug = productTypeSlug.trim();
  const isDuplicateName =
    !!productTypes?.some(t => t.name.toLowerCase() === trimmedProductType.toLowerCase());
  const isDuplicateSlug =
    !!productTypes?.some(t => t.slug.toLowerCase() === trimmedProductTypeSlug.toLowerCase());

  const isInvalid = () => {
    if(isDuplicateName) return true;
    if(isDuplicateSlug) return true;
    if(trimmedProductType.length === 0) return true;
    if(trimmedProductTypeSlug.length === 0) return true;
    if(trimmedProductTypeSlug.includes(" ")) return true;

    return false;
  };

  const handleSubmit = () => {
    setError("");
    createProductType({
      name: trimmedProductType,
      slug: trimmedProductType,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} >
      <Dialog.Trigger asChild>
        <button>Create product type</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>Create a product type</Dialog.Title>
          <Dialog.Description className={styles.dialogDescription}>
            Create product type to categorise your products
          </Dialog.Description>
          <div className="form">
            <div className="formGroup">
              <label className="Label" htmlFor="productType">
                Name
              </label>
              <input className="Input" id="productType" value={productTypeName} onChange={(e) => setProductTypeName(e.target.value)} />
              {isDuplicateName && <p className="error">That name already exists.</p>}
            </div>
            <div className="formGroup">
              <label className="Label" htmlFor="productSlug">
                Slug
              </label>
              <input className="Input" id="productSlug" value={productTypeSlug} onChange={(e) => setProductTypeSlug(e.target.value)} />
              {isDuplicateSlug && <p className="error">That slug already exists.</p>}
            </div>
            {error && <p className="error">{error}</p>}
            <div
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <button disabled={isInvalid()} onClick={handleSubmit}>Create</button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateProductTypeModal;