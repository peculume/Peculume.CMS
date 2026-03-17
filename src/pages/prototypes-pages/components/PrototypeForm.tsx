import { FC, useEffect, useState } from 'react';
import { ProductType } from 'types/productTypes';
import {
  Prototype,
  PrototypeStatus,
  useCreatePrototype,
  useDeletePrototype,
  useGetPrototypeStatuses,
  useUpdatePrototype,
} from 'hooks/prototype-hooks/PrototypeHooks';
import { useGetProductTypes } from 'hooks/ProductTypeHooks/ProductTypeHooks';
import { Lore, useGetLore } from 'hooks/lore-hooks/LoreHooks';
import CreateProductTypeModal from 'modals/CreateProductTypeModal/CreateProductTypeModal';
import { CategoryPicker } from 'components';
import { FragranceCategory, FragranceMix } from 'types/fragranceTypes';
import FragranceMixPicker from 'components/fragrance-mix-picker/FragranceMixPicker';
import { useGetFragranceMixes } from 'pages/fragrance-mix-pages/hooks/FragranceMixHooks';

type PrototypeFormProps = {
  prototype?: Prototype;
};

const PrototypeForm: FC<PrototypeFormProps> = ({ prototype }) => {
  const isEditing = !!prototype;

  const [name, setName] = useState(prototype?.name ?? '');
  const [description, setDescription] = useState(prototype?.description ?? '');
  const [notes, setNotes] = useState(prototype?.notes ?? '');
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [loreEntry, setLoreEntry] = useState<Lore | null>(null);
  const [status, setStatus] = useState<PrototypeStatus | null>(null);
  const [categories, setCategories] = useState<FragranceCategory[]>(
    prototype?.categories ?? [],
  );
  const [fragranceMixes, setFragranceMixes] = useState<FragranceMix[]>([]);

  const [error, setError] = useState<string | null>(null);

  const { productTypes, isProductTypesLoading } = useGetProductTypes();
  const { lore, loreLoading } = useGetLore();
  const { prototypeStatuses, isPrototypeStatusesLoading } =
    useGetPrototypeStatuses();
  const { fragranceMixes: allFragranceMixes } = useGetFragranceMixes();

  // Resolve IDs to full objects once data loads (edit mode only)
  useEffect(() => {
    if (prototype && productTypes.length > 0 && !productType) {
      setProductType(
        productTypes.find((p) => p.productTypeId === prototype.productTypeId) ??
          null,
      );
    }
  }, [productTypes]);

  useEffect(() => {
    if (prototype?.loreEntryId && lore.length > 0 && !loreEntry) {
      setLoreEntry(
        lore.find((l) => l.loreId === prototype.loreEntryId) ?? null,
      );
    }
  }, [lore]);

  useEffect(() => {
    if (prototype && prototypeStatuses.length > 0 && !status) {
      setStatus(
        prototypeStatuses.find(
          (s) => s.prototypeStatusId === prototype.statusId,
        ) ?? null,
      );
    }
  }, [prototypeStatuses]);

  useEffect(() => {
    if (
      prototype &&
      allFragranceMixes.length > 0 &&
      fragranceMixes.length === 0
    ) {
      const initial = allFragranceMixes.filter((mix) =>
        prototype.fragranceMixes.some(
          (m) => m.fragranceMixId === mix.fragranceMixId,
        ),
      );
      if (initial.length > 0) setFragranceMixes(initial);
    }
  }, [allFragranceMixes]);

  const { createPrototype, createPrototypePending } = useCreatePrototype({
    onError(err) {
      setError(err.message);
    },
  });

  const { updatePrototype, updatePrototypePending } = useUpdatePrototype({
    onError(err) {
      setError(err.message);
    },
  });

  const { deletePrototype } = useDeletePrototype({
    onError(err) {
      setError(err.message);
    },
  });

  const isPending = createPrototypePending || updatePrototypePending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productType) {
      setError('Please select a product type');
      return;
    }
    setError(null);

    const payload = {
      name,
      description,
      notes,
      productTypeId: productType.productTypeId ?? 0,
      loreEntryId: loreEntry?.loreId ?? null,
      statusId: status?.prototypeStatusId ?? null,
      categoryIds: categories.map((c) => c.categoryId),
      fragranceMixIds: fragranceMixes.map((m) => m.fragranceMixId),
    };

    if (isEditing) {
      updatePrototype({ prototypeId: prototype.prototypeId, ...payload });
    } else {
      createPrototype(payload);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="formGroup">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="formGroup">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="formGroup">
        <label htmlFor="notes">Notes</label>
        <input
          id="notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="formGroup">
        <label htmlFor="productType">Product Type</label>
        {isProductTypesLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="selector">
            <select
              id="productType"
              onChange={(e) =>
                setProductType(
                  productTypes.find(
                    ({ productTypeId }) =>
                      productTypeId == Number(e.target.value),
                  ) ?? null,
                )
              }
              value={productType?.productTypeId ?? ''}
            >
              <option value="">Select a product type...</option>
              {productTypes.map(({ productTypeId, name }) => (
                <option key={productTypeId} value={productTypeId}>
                  {name}
                </option>
              ))}
            </select>
            <CreateProductTypeModal />
          </div>
        )}
      </div>
      <div className="formGroup">
        <label htmlFor="loreEntry">Lore Entry</label>
        {loreLoading ? (
          <p>Loading...</p>
        ) : (
          <select
            id="loreEntry"
            onChange={(e) =>
              setLoreEntry(
                lore.find(({ loreId }) => loreId == Number(e.target.value)) ??
                  null,
              )
            }
            value={loreEntry?.loreId ?? ''}
          >
            <option value="">Select a lore entry...</option>
            {lore.map(({ loreId, name }) => (
              <option key={loreId} value={loreId}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="formGroup">
        <label htmlFor="status">Status</label>
        {isPrototypeStatusesLoading ? (
          <p>Loading...</p>
        ) : (
          <select
            id="status"
            onChange={(e) =>
              setStatus(
                prototypeStatuses.find(
                  ({ prototypeStatusId }) =>
                    prototypeStatusId == Number(e.target.value),
                ) ?? null,
              )
            }
            value={status?.prototypeStatusId ?? ''}
          >
            <option value="">Select a status...</option>
            {prototypeStatuses.map(({ prototypeStatusId, name }) => (
              <option key={prototypeStatusId} value={prototypeStatusId}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>
      <CategoryPicker
        selectedCategories={categories}
        setSelectedCategories={setCategories}
        canCreate={true}
      />
      <FragranceMixPicker
        selected={fragranceMixes}
        setSelected={setFragranceMixes}
        canCreate={true}
      />
      <div className="actions-container">
        {isEditing && (
          <button
            type="button"
            className="danger"
            onClick={() =>
              deletePrototype({ prototypeId: prototype.prototypeId })
            }
          >
            Delete
          </button>
        )}
        <input type="submit" value="Save" disabled={isPending} />
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default PrototypeForm;
