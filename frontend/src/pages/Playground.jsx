import { useState } from "react";
import pieces from "@data/playground.json";
import styles from "@styles/playground.module.css";
import useReveal from "@hooks/useReveal";
import PlaygroundModal from "@components/playgroundModal";

function Playground() {
    const [boardRef, boardVisible] = useReveal(0.1);
    const [openPiece, setOpenPiece] = useState(null);

    return (
        <div className="root_container">
            <section id={styles.intro} className="section">
                <p className={styles.section_label}>
                    <span aria-hidden="true">✦</span> just for fun
                </p>
                <h1 id={styles.title}>Playground</h1>
                <p id={styles.subtitle}>
                    Experiments, side quests and things I make just for fun.
                </p>
            </section>

            <section
                ref={boardRef}
                className={`section ${styles.board} ${boardVisible ? styles.visible : ""}`}
            >
                <ul id={styles.piece_list} aria-label="Playground pieces">
                    {pieces.map((piece, index) => {
                        const cover = piece.images[0];

                        return (
                            <li
                                key={piece.id}
                                className={`${styles.piece} ${styles[piece.shape]} ${piece.size === "small" ? styles.small : ""}`}
                                style={{ "--i": index, "--rotate": `${piece.rotate}deg` }}
                            >
                                {/* a polaroid taped to the board; the whole card opens the gallery */}
                                <button
                                    type="button"
                                    className={styles.polaroid}
                                    onClick={() => setOpenPiece(piece)}
                                    aria-haspopup="dialog"
                                    aria-label={`${piece.title}, ${piece.date}, ${piece.tag}${
                                        piece.images.length > 1 ? `, ${piece.images.length} photos` : ""
                                    }`}
                                >
                                    <span className={`${styles.tape} ${styles[`tape_${piece.tape}`]}`} aria-hidden="true" />
                                    <span className={styles.photo}>
                                        <img
                                            src={cover.src}
                                            alt={cover.alt}
                                            loading="lazy"
                                            style={{
                                                objectPosition: cover.focus || "50% 50%",
                                                // zoom crops in on the best part of a busy photo
                                                transform: cover.zoom ? `scale(${cover.zoom})` : undefined,
                                                transformOrigin: cover.focus,
                                            }}
                                        />
                                        {piece.images.length > 1 && (
                                            <span className={styles.count}>
                                                {piece.images.length} photos
                                            </span>
                                        )}
                                    </span>
                                    <span className={styles.caption}>
                                        <span className={styles.piece_title}>{piece.title}</span>
                                        <span className={styles.piece_meta}>
                                            {piece.date} · {piece.tag}
                                        </span>
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </section>

            {openPiece && (
                <PlaygroundModal key={openPiece.id} piece={openPiece} onClose={() => setOpenPiece(null)} />
            )}
        </div>
    );
}

export default Playground;
