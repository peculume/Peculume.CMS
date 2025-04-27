import { FC, FormEvent, FormEventHandler, useState } from "react";
import { Product, Tag } from "types/productTypes";
import styles from "./ProductForm.module.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_BASE_URL, BUILD_TIME_API_KEY } from "api/config";

type ProductFormTypes = {
  product?: Product;
}

const ProductForm: FC<ProductFormTypes> = ({ product }) => {
  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(product?.tags ?? []);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useQuery({
    queryKey: ["getTags"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/tags/`, {
        method: 'GET',
        headers: {
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching tags: ${response.status}`;
      }
      const resp = await response.json() as Tag[];
      const filtered = resp.filter(tag => !tags.some(t => t.tagId === tag.tagId));
      setAvailableTags(filtered);
      return resp;
    }
  })

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
          tagIds: tags.map(({ tagId }) => tagId),
        }),
      });

      if (!response.ok) {
        throw `Error update product: ${response.status}`;
      }

      return await response.json() as Product;
    },
    onError: (error) => {

    },
    onSuccess: () => {

    },
  });

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
    }
  }

  return (
    <form className={styles.form} onSubmit={handleOnSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="slug">Slug</label>
        <input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
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
          <button type="button">
            Create tag
          </button>
        </div>
      </div>
      <input className={styles.submitButton} type="submit" value="Save" />
    </form>
  );
};

export default ProductForm;