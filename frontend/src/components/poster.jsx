import { useRef } from "react";
import styles from "@styles/poster.module.css";

// An image shown as a taped-down print, with a full-size view.
function Poster({ src, fullSrc, alt }) {
    const dialogRef = useRef(null);

    return (
        <figure className={styles.poster}>
            <div className={styles.print}>
                <span className={`${styles.tape} ${styles.tape_left}`} aria-hidden="true" />
                <span className={`${styles.tape} ${styles.tape_right}`} aria-hidden="true" />
                <img src={src} alt={alt} />
            </div>

            <figcaption className={styles.caption}>
                <button type="button" onClick={() => dialogRef.current.showModal()}>
                    View it full size <span aria-hidden="true">⤢</span>
                </button>
            </figcaption>

            <dialog
                ref={dialogRef}
                className={styles.dialog}
                aria-label="Full-size infographic"
                // clicking the dark backdrop (the dialog itself, outside the scroller) closes it
                onClick={(event) => event.target === dialogRef.current && dialogRef.current.close()}
            >
                <button type="button" className={styles.close} onClick={() => dialogRef.current.close()}>
                    Close
                </button>
                <div className={styles.scroller}>
                    <img src={fullSrc} alt={alt} loading="lazy" />
                </div>
            </dialog>
        </figure>
    );
}

export default Poster;
