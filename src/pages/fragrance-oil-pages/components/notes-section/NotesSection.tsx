import { FC } from 'react';
import styles from './NotesSection.module.scss';

type NotesSectionProps = {
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  setTopNotes: (value: string) => void;
  setHeartNotes: (value: string) => void;
  setBaseNotes: (value: string) => void;
};

const NotesSection: FC<NotesSectionProps> = ({
  topNotes,
  heartNotes,
  baseNotes,
  setTopNotes,
  setHeartNotes,
  setBaseNotes,
}) => {
  return (
    <div className={styles.notesSection}>
      <div className={styles.notesHeader}>
        <h3>Notes</h3>
        <p className={styles.notesDescription}>
          Describe what you smell at each stage of the fragrance.
        </p>
      </div>

      <div className={styles.notesGrid}>
        <div className={`formGroup ${styles.noteBucket}`}>
          <div className={styles.noteBucketHeader}>
            <span className={`${styles.noteBadge} ${styles.noteBadgeTop}`}>
              Top
            </span>
            <div>
              <label htmlFor="top-notes">Top notes</label>
              <p className={styles.noteHint}>
                First impression (opening blast, 0–30 mins).
              </p>
            </div>
          </div>
          <input
            id="top-notes"
            type="text"
            placeholder="e.g. citrus, bergamot, aldehydes"
            value={topNotes}
            onChange={(e) => setTopNotes(e.target.value)}
          />
        </div>

        <div className={`formGroup ${styles.noteBucket}`}>
          <div className={styles.noteBucketHeader}>
            <span className={`${styles.noteBadge} ${styles.noteBadgeHeart}`}>
              Heart
            </span>
            <div>
              <label htmlFor="heart-notes">Heart notes</label>
              <p className={styles.noteHint}>
                Main character (develops after the opening).
              </p>
            </div>
          </div>
          <input
            id="heart-notes"
            type="text"
            placeholder="e.g. rose, jasmine, spices"
            value={heartNotes}
            onChange={(e) => setHeartNotes(e.target.value)}
          />
        </div>

        <div className={`formGroup ${styles.noteBucket}`}>
          <div className={styles.noteBucketHeader}>
            <span className={`${styles.noteBadge} ${styles.noteBadgeBase}`}>
              Base
            </span>
            <div>
              <label htmlFor="base-notes">Base notes</label>
              <p className={styles.noteHint}>
                Drydown and lingering impression (hours later).
              </p>
            </div>
          </div>
          <input
            id="base-notes"
            type="text"
            placeholder="e.g. woods, musk, vanilla"
            value={baseNotes}
            onChange={(e) => setBaseNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
