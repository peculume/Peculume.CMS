import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL, BUILD_TIME_API_KEY } from "api/config";
import { ApiError, Image, Product, Tag } from "types/productTypes";
import { getImage, uploadImage } from "utils/supabaseUtils";
import { useGetTags } from "hooks/TagHooks/TagHooks";
import CreateTagModal from "modals/CreateTagModal/CreateTagModal";
import styles from "./ProductForm.module.scss";
import { useCreateImage } from "hooks/ImageHooks/ImageHooks";

type ProductFormTypes = {
  product?: Product;
}

const ProductForm: FC<ProductFormTypes> = ({ product }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<Image[]>(product?.images ?? []);
  const [tags, setTags] = useState(product?.tags ?? []);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  const [errorMessage, setErrorMessage] = useState("");

  const { tags: dataTags } = useGetTags();

  useEffect(() => {
    const filtered = dataTags.filter(tag => !tags.some(t => t.tagId === tag.tagId));
    setAvailableTags(filtered);
  }, [dataTags])

  const { mutate: updateProduct } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/products/${product?.productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          imageIds: images.map(({ imageId }) => imageId),
          tagIds: tags.map(({ tagId }) => tagId),
        }),
      });

      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw error;
      }

      return await response.json() as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] })
      queryClient.invalidateQueries({ queryKey: ["getProduct", product?.productId.toString()] })
    },
    onError: (error: ApiError) => {
      setErrorMessage(error.message);
    }
  });

  const { mutate: createProduct } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          imageIds: images.map(({ imageId }) => imageId),
          tagIds: tags.map(({ tagId }) => tagId),
        }),
      });

      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw error;
      }

      return await response.json() as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] })
      navigate("/products");
    },
    onError: (error: ApiError) => {
      setErrorMessage(error.message);
    }
  });

  const { mutate: deleteProduct } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/products/${product?.productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
        },
      });

      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] })
      navigate("/products");
    },
    onError: (error: ApiError) => {
      setErrorMessage(error.message);
    }
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { createImage } = useCreateImage({
    onSuccess: (image) => {
      if (!images.find(({ name }) => name === image.name)) {
        setImages((prev) => ([
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
      createImage({ url: data.publicUrl, name: name })

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
    if (product) {
      updateProduct();
    } else {
      createProduct();
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
        {images.length == 0 ? (
          <div className={styles.imageUploader} >
            <div>
              <input type="button" value="Upload new" onClick={() => fileInputRef.current?.click()} />
              <input type="button" value="Select existing" />
            </div>
            <p className={styles.mediaDescriptionText}>Accepts images and 3D models</p>
          </div>
        ) : (
          <div className={styles.imagesGrid}>
            {images.slice(0, 9).map(({ imageId, url }, index) => (
              <div
                key={imageId}
                className={index === 0 ? styles.largeImage : styles.smallImage}
              >
                <img src={url} />
              </div>
            ))}

            {images.length < 9 && !isUploadingImage && (
              <div
                className={`${styles.smallImage} ${styles.addImage}`}
                onClick={() => fileInputRef.current?.click()}
              >
                +
              </div>
            )}
            {images.length < 9 && isUploadingImage && (
              <div
              >
                Uploading...
              </div>
            )}
          </div>
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
      <div>
        <div className={styles.buttonsContainer}>
          {product && (
            <button className="danger" onClick={() => deleteProduct()}>Delete</button>
          )}
          <input className={styles.submitButton} type="submit" value="Save" />
        </div>
        {errorMessage && (
          <p className="error">{errorMessage}</p>
        )}
      </div>
    </form>
  );
};

export default ProductForm;