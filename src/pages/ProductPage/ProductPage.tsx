import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, BUILD_TIME_API_KEY } from "api/config";
import { Product, ProductVersion } from "types/productTypes";
import { ProductForm } from "components";
import styles from "./ProductPage.module.scss";

const formatVersion = (version?: string | null) => {
  if (!version) {
    return "-";
  }

  return version.toLowerCase().startsWith("v") ? version : `v${version}`;
};

const formatDate = (date?: string | null) => {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(price);

const sortVersions = (versions: ProductVersion[]) =>
  [...versions].sort((a, b) => b.productVersionId - a.productVersionId);

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
    null,
  );

  const { data: product } = useQuery({
    queryKey: ["getProduct", productId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/products/id/${productId}`, {
        method: 'GET',
        headers: {
          "X-Build-Time-Api-Key": BUILD_TIME_API_KEY,
        },
      });
      if (!response.ok) {
        throw `Error fetching product: ${response.status}`;
      }
      const resp = await response.json() as Product;
      return resp;
    }
  })

  const versions = useMemo(
    () => (product ? sortVersions(product.versions) : []),
    [product],
  );
  const selectedVersion =
    versions.find((version) => version.productVersionId === selectedVersionId) ??
    product?.activeVersion ??
    versions[0];

  if (!product) {
    return null;
  }

  const previousVersionCount = versions.filter(
    (version) => version.productVersionId !== product.activeVersionId,
  ).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate("/products")}>Back</button>
        <h2 className={styles.title}>{product.name}</h2>
      </div>
      <section className={styles.versionBrowser}>
        <div className={styles.versionBrowserHeader}>
          <div>
            <p className={styles.eyebrow}>Product versions</p>
            <h3>Current: {formatVersion(product.activeVersion?.version)}</h3>
          </div>
          <span>
            {previousVersionCount} previous{" "}
            {previousVersionCount === 1 ? "version" : "versions"}
          </span>
        </div>

        {versions.length > 0 && selectedVersion ? (
          <div className={styles.versionBrowserContent}>
            <div className={styles.versionList}>
              {versions.map((version) => {
                const isActive =
                  version.productVersionId === product.activeVersionId;
                const isSelected =
                  version.productVersionId === selectedVersion.productVersionId;

                return (
                  <button
                    key={version.productVersionId}
                    type="button"
                    className={`${styles.versionButton} ${
                      isSelected ? styles.selected : ""
                    }`}
                    onClick={() =>
                      setSelectedVersionId(version.productVersionId)
                    }
                  >
                    <strong>{formatVersion(version.version)}</strong>
                    <span>{version.name}</span>
                    <small>{isActive ? "Current" : version.status}</small>
                  </button>
                );
              })}
            </div>

            <div className={styles.versionDetails}>
              <div className={styles.versionDetailsHeader}>
                <div>
                  <p className={styles.eyebrow}>
                    {selectedVersion.productVersionId === product.activeVersionId
                      ? "Current version"
                      : "Previous version"}
                  </p>
                  <h3>{selectedVersion.name}</h3>
                </div>
                <span
                  className={`${styles.statusPill} ${
                    styles[selectedVersion.status.toLowerCase()]
                  }`}
                >
                  {selectedVersion.status}
                </span>
              </div>

              <dl className={styles.versionMeta}>
                <div>
                  <dt>Version</dt>
                  <dd>{formatVersion(selectedVersion.version)}</dd>
                </div>
                <div>
                  <dt>Price</dt>
                  <dd>{formatPrice(selectedVersion.price)}</dd>
                </div>
                <div>
                  <dt>SKU</dt>
                  <dd>{selectedVersion.sku || "-"}</dd>
                </div>
                <div>
                  <dt>Slug</dt>
                  <dd>{selectedVersion.slug || "-"}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{formatDate(selectedVersion.createdAt)}</dd>
                </div>
                <div>
                  <dt>Published</dt>
                  <dd>{formatDate(selectedVersion.publishedAt)}</dd>
                </div>
                <div>
                  <dt>Retired</dt>
                  <dd>{formatDate(selectedVersion.retiredAt)}</dd>
                </div>
              </dl>

              <div className={styles.versionDescription}>
                <h4>Description</h4>
                {selectedVersion.description ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedVersion.description,
                    }}
                  />
                ) : (
                  <p>No description saved for this version.</p>
                )}
              </div>

              <div className={styles.versionMixes}>
                <h4>Fragrance mix versions</h4>
                {selectedVersion.fragranceMixVersions.length > 0 ? (
                  <div className={styles.mixList}>
                    {selectedVersion.fragranceMixVersions.map((mix) => (
                      <div
                        className={styles.mixCard}
                        key={mix.fragranceMixVersionId}
                      >
                        <strong>
                          {mix.fragranceMixName} {formatVersion(mix.version)}
                        </strong>
                        {mix.notes && <p>{mix.notes}</p>}
                        {mix.fragranceOils.length > 0 && (
                          <ul>
                            {mix.fragranceOils.map((oil) => (
                              <li key={oil.fragranceOilId}>
                                {oil.name} ({oil.mixRatio}%)
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No fragrance mix versions assigned.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className={styles.emptyVersions}>No versions recorded yet.</p>
        )}
      </section>
      <ProductForm product={product} />
    </div>
  );
};

export default ProductPage;
