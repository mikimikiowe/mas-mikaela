import pieces from "@data/playground.json";
import styles from "@styles/playground.module.css";
import useReveal from "@hooks/useReveal";

function Playground() {
    const [boardRef, boardVisible] = useReveal(0.1);

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
                    {pieces.map((piece, index) => (
                        <li
                            key={piece.id}
                            className={`${styles.piece} ${styles[piece.shape]}`}
                            style={{ "--i": index, "--rotate": `${piece.rotate}deg` }}
                        >
                            {/* swap this placeholder for an <img> once the work is ready */}
                            <div className={`${styles.placeholder} ${styles[piece.tint]}`}>
                                <span aria-hidden="true">✦</span>
                                <p>{piece.name}</p>
                                <p className={styles.soon}>landing soon</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default Playground;
