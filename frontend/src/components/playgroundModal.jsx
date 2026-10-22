import { useEffect, useRef, useState } from "react";
import styles from "@styles/playgroundModal.module.css";

// A gallery window for one playground piece: its photos on the left, the story on the right.
function PlaygroundModal({ piece, onClose }) {
    const dialogRef = useRef(null);
    const [index, setIndex] = useState(0);
    const total = piece.images.length;
    const image = piece.images[index];

    const show = (next) => setIndex((next + total) % total);

    useEffect(() => {
        const dialog = dialogRef.current;
        dialog.showModal();

        // stop the page behind from scrolling while the window is open
        const { overflow } = document.documentElement.style;
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = overflow;
        };
    }, []);

    function handleKeyDown(event) {
        if (total < 2) return;
        if (event.key === "ArrowRight") show(index + 1);
        if (event.key === "ArrowLeft") show(index - 1);
    }

    return (
        <dialog
            ref={dialogRef}
            className={styles.modal}
            aria-labelledby={`${piece.id}-title`}
            onClose={onClose}
            onKeyDown={handleKeyDown}
            // clicking the backdrop (the dialog itself, outside the panel) closes it
            onClick={(event) => event.target === dialogRef.current && dialogRef.current.close()}
        >
            <div className={styles.panel}>
                <button type="button" className={styles.close} onClick={() => dialogRef.current.close()}>
                    <span aria-hidden="true">✕</span>
                    <span className={styles.visually_hidden}>Close</span>
                </button>

                <div className={styles.gallery}>
                    <div className={styles.stage}>
                        {/* the blurred copy fills the frame behind photos that don't match its shape */}
                        <img key={`${image.src}-bg`} src={image.src} alt="" className={styles.backdrop} aria-hidden="true" />
                        <img key={image.src} src={image.src} alt={image.alt} className={styles.photo} />

                        {total > 1 && (
                            <>
                                <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => show(index - 1)}>
                                    <span aria-hidden="true">←</span>
                                    <span className={styles.visually_hidden}>Previous photo</span>
                                </button>
                                <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => show(index + 1)}>
                                    <span aria-hidden="true">→</span>
                                    <span className={styles.visually_hidden}>Next photo</span>
                                </button>
                                <p className={styles.counter} aria-hidden="true">
                                    {index + 1} / {total}
                                </p>
                            </>
                        )}
                    </div>

                    {/* tells screen reader users which photo they've moved to, and what's in it */}
                    <p className={styles.visually_hidden} aria-live="polite">
                        {total > 1 ? `Photo ${index + 1} of ${total}: ` : ""}
                        {image.alt}
                    </p>

                    {total > 1 && (
                        <ul className={styles.thumbs} aria-label="Photos">
                            {piece.images.map((thumb, thumbIndex) => (
                                <li key={thumb.src}>
                                    <button
                                        type="button"
                                        onClick={() => setIndex(thumbIndex)}
                                        aria-current={thumbIndex === index ? "true" : undefined}
                                        aria-label={`Photo ${thumbIndex + 1} of ${total}`}
                                    >
                                        <img src={thumb.src} alt={thumb.alt} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className={styles.story}>
                    <p className={styles.meta}>
                        <span>{piece.date}</span>
                        <span className={styles.tag}>{piece.tag}</span>
                    </p>
                    <h2 id={`${piece.id}-title`}>{piece.title}</h2>
                    {piece.body.map((block, blockIndex) =>
                        block.list ? (
                            <ul key={blockIndex} className={styles.list}>
                                {block.list.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p key={blockIndex}>{block.text}</p>
                        )
                    )}
                </div>
            </div>
        </dialog>
    );
}

export default PlaygroundModal;
