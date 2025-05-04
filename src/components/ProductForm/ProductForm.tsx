import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { ApiError, Media, Product, ProductType, Tag } from "types/productTypes";
import { getImage, uploadImage } from "utils/supabaseUtils";
import { useCreateProduct, useDeleteProduct, useUpdateProduct } from "hooks/ProductHooks/ProductHooks";
import { useGetTags } from "hooks/TagHooks/TagHooks";
import { useCreateImage } from "hooks/MediaHooks/MediaHooks";
import CreateTagModal from "modals/CreateTagModal/CreateTagModal";
import styles from "./ProductForm.module.scss";
import { useGetProductTypes } from "hooks/ProductTypeHooks/ProductTypeHooks";

type ProductFormTypes = {
  product?: Product;
}

const ProductForm: FC<ProductFormTypes> = ({ product }) => {
  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<Media[]>(product?.media ?? []);
  const [productType, setProductType] = useState<ProductType | null>(product?.productType ?? null);
  const [tags, setTags] = useState(product?.tags ?? []);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [price, setPrice] = useState<number>(product?.price ?? 9.99);

  const [errorMessage, setErrorMessage] = useState("");

  const { tags: dataTags } = useGetTags();

  const { productTypes, isProductTypesLoading } = useGetProductTypes();

  useEffect(() => {
    const filtered = dataTags.filter(tag => !tags.some(t => t.tagId === tag.tagId));
    setAvailableTags(filtered);
  }, [dataTags])

  const { createProduct, createProductPending } = useCreateProduct({
    onSuccess: (product) => {
      setErrorMessage("");
    },
    onError: (error: ApiError) => {
      setErrorMessage(error.message);
    }
  });

  const { updateProduct, updateProductPending } = useUpdateProduct({
    onSuccess: (product) => {
      setErrorMessage("");
    },
    onError: (error: ApiError) => {
      setErrorMessage(error.message);
    }
  });

  const { deleteProduct } = useDeleteProduct({
    onError: (error: ApiError) => {
      setErrorMessage(error.message);
    }
  })

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { createImage } = useCreateImage({
    onSuccess: (image) => {
      if (!media.find(({ name }) => name === image.name)) {
        setMedia((prev) => ([
          ...prev,
          image
        ]));
      }
      setIsUploadingImage(false);
    },
    onError: () => {
      setIsUploadingImage(false);
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    if (selected !== null) {
      const name = selected.name;
      const { error: uploadError } = await uploadImage(selected, name);
      if (uploadError) {
        return;
      }

      const { data } = getImage(name);
      setIsUploadingImage(true);
      createImage({ url: data.publicUrl, name: name, type: "Image" });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  const handleTagSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTagId = e.target.value;
    const selectedTag = availableTags.find(tag => tag.tagId == selectedTagId);
    if (selectedTag) {
      setTags(prev => [...prev, selectedTag]);
      setAvailableTags(prev => prev.filter(tag => tag.tagId != selectedTagId));
    }
    e.target.selectedIndex = 0;
  };

  const handleRemoveTag = (tagToRemove: Tag) => {
    setTags(prev => prev.filter(tag => tag.tagId !== tagToRemove.tagId));
    setAvailableTags(prev => [...prev, tagToRemove]);
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productType) {
      setErrorMessage("Please select a product type");
      return;
    }

    if (product) {
      updateProduct({
        productId: product.productId,
        name,
        slug,
        description,
        media,
        productType,
        tags,
        price
      });
    } else {
      createProduct({
        name,
        slug,
        description,
        media,
        productType,
        tags,
        price,
      });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleOnSubmit}>
      <div className="formGroup">
        <label htmlFor="name">Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="formGroup">
        <label htmlFor="slug">Slug</label>
        <input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>
      <div className="formGroup">
        <label htmlFor="description">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="formGroup">
        <label>Media</label>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} disabled={isUploadingImage} />
        {media.length == 0 ? (
          <div className={styles.imageUploader} >
            <div>
              <input type="button" value="Upload new" onClick={() => fileInputRef.current?.click()} />
              <input type="button" value="Select existing" />
            </div>
            <p className={styles.mediaDescriptionText}>Accepts images and 3D models</p>
          </div>
        ) : (
          <div className={styles.imagesGrid}>
            {media.slice(0, 9).map(({ mediaId, url }, index) => (
              <div
                key={mediaId}
                className={index === 0 ? styles.largeImage : styles.smallImage}
              >
                <img src={url} />
              </div>
            ))}

            {media.length < 9 && !isUploadingImage && (
              <div
                className={`${styles.smallImage} ${styles.addImage}`}
                onClick={() => fileInputRef.current?.click()}
              >
                +
              </div>
            )}
            {media.length < 9 && isUploadingImage && (
              <div
              >
                Uploading...
              </div>
            )}
          </div>
        )}
      </div>
      <div className="formGroup">
        <label htmlFor="productType">Product Type</label>
        {!isProductTypesLoading && (
          <select id="productType"
            onChange={(e) => setProductType(productTypes.find(({ productTypeId }) => productTypeId == Number(e.target.value)) ?? null)}
            defaultValue={product?.productType?.productTypeId ?? ""}
          >
            <option value="">Select a product type...</option>
            {productTypes.map(({ productTypeId, name }) => (
              <option key={productTypeId} value={productTypeId}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="formGroup">
        <label htmlFor="tags">Tags</label>
        <div className={styles.selectedTags}>
          {tags.map((tag) => (
            <div key={tag.tagId} className={styles.tagItem}>
              {tag.name}
              <button
                type="button"
                className={styles.removeTagButton}
                onClick={() => handleRemoveTag(tag)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className={styles.tagSelector}>
          {availableTags.length > 0 && (
            <select id="tags" onChange={handleTagSelect}>
              <option value="">Select a tag...</option>
              {availableTags.map((tag) => (
                <option key={tag.tagId} value={tag.tagId}>
                  {tag.name}
                </option>
              ))}
            </select>
          )}
          <CreateTagModal />
        </div>
      </div>
      <div className="formGroup">
        <label htmlFor="price">Price</label>
        <div className={styles.priceInputContainer}>
          <p>£</p>
          <input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>
      </div>
      <div>
        <div className={styles.buttonsContainer}>
          {product && (
            <button className="danger" onClick={() => deleteProduct({ productId: product.productId })}>Delete</button>
          )}
          <input className={styles.submitButton} type="submit" value="Save" disabled={createProductPending || updateProductPending} />
        </div>
        {errorMessage && (
          <p className="error">{errorMessage}</p>
        )}
      </div>
    </form>
  );
};

export default ProductForm;