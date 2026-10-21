import { useEffect, useRef, useState } from "react";
import styles from "@styles/laptop.module.css";

// the site renders at a real desktop width, then is scaled down to fit the screen
const SITE_WIDTH = 1440;
const SITE_HEIGHT = 900;

// A laptop frame with a live, scrollable website on its screen.
function Laptop({ url, title }) {
    const screenRef = useRef(null);
    const [scale, setScale] = useState(0);

    useEffect(() => {
        const screen = screenRef.current;
        if (!screen) return;

        const observer = new ResizeObserver(([entry]) => {
            setScale(entry.contentRect.width / SITE_WIDTH);
        });

        observer.observe(screen);
        return () => observer.disconnect();
    }, []);

    return (
        <figure className={styles.laptop}>
            <div className={styles.lid}>
                <span className={styles.camera} aria-hidden="true" />
                <div ref={screenRef} className={styles.screen}>
                    {scale > 0 && (
                        <iframe
                            src={url}
                            title={title}
                            loading="lazy"
                            style={{ width: SITE_WIDTH, height: SITE_HEIGHT, transform: `scale(${scale})` }}
                        />
                    )}
                </div>
            </div>
            <div className={styles.base} aria-hidden="true">
                <span className={styles.notch} />
            </div>
            <figcaption className={styles.caption}>
                <span>Scroll inside the screen to explore the live site.</span>
                <a href={url} target="_blank" rel="noopener noreferrer">
                    Open it in a new tab <span aria-hidden="true">↗</span>
                </a>
            </figcaption>
        </figure>
    );
}

export default Laptop;
