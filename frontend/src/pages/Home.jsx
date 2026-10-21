import styles from "@styles/home.module.css";
import { useRef } from "react";
import { Link } from "react-router-dom";
import useReveal from "@hooks/useReveal";
import useScrollProgress from "@hooks/useScrollProgress";

const HOW_MIGHT_WE = [
    { text: "How might we create" },
    { text: "user-centred experiences", highlight: true },
    { text: "that" },
    { text: "empower people", highlight: true },
    { text: "and" },
    { text: "open space for more women", highlight: true },
    { text: "in business and technology?" },
];

const WORD_COUNT = HOW_MIGHT_WE.reduce((count, segment) => count + segment.text.split(" ").length, 0);

const DESTINATIONS = [
    {
        name: "Projects",
        blurb: "Case studies, hackathons and interactive systems I've designed and built.",
        to: "/projects",
        planet: "planet_projects",
    },
    {
        name: "About me",
        blurb: "My story, my skills, and the communities I'm building along the way.",
        to: "/about",
        planet: "planet_about",
    },
    {
        name: "Playground",
        blurb: "Experiments, side quests and things I make just for fun.",
        to: "/playground",
        planet: "planet_playground",
    },
];

function Home() {
    const photoRef = useRef(null);
    const missionRef = useScrollProgress(0.85, 0.35);
    const [exploreRef, exploreVisible] = useReveal(0.2);

    function handleTilt(event) {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        photoRef.current.style.setProperty("--tilt-x", `${y * -8}deg`);
        photoRef.current.style.setProperty("--tilt-y", `${x * 10}deg`);
    }

    function resetTilt() {
        photoRef.current.style.setProperty("--tilt-x", "0deg");
        photoRef.current.style.setProperty("--tilt-y", "0deg");
    }

    let wordIndex = 0;

    return (
        <div className="root_container">
            <section id={styles.hero} className="section">
                <div id={styles.hero_text}>
                    <h1 id={styles.name}>Mikaela Olarte</h1>
                    <p id={styles.tagline}>
                        this is{" "}
                        <span className={styles.mas} tabIndex={0}>
                            más
                            <span className={styles.mas_definition} role="tooltip">
                                más <em>(adv.)</em>: Spanish for “more”
                            </span>
                        </span>{" "}
                        of me. <strong>más mikaela.</strong>
                    </p>
                    <p id={styles.intro}>
                        UX/UI Designer with accessibility in mind and founder of Women in Business and
                        Technology at Sheridan College, designing experiences that make SPACE for everyone!
                    </p>
                    <div id={styles.actions}>
                        <Link to="/projects" className={`${styles.button} ${styles.button_primary}`}>
                            Explore my projects <span aria-hidden="true">→</span>
                        </Link>
                        <Link to="/about" className={`${styles.button} ${styles.button_ghost}`}>
                            About me
                        </Link>
                    </div>
                </div>

                <div id={styles.hero_visual} onPointerMove={handleTilt} onPointerLeave={resetTilt}>
                    <div className={styles.planet_glow} aria-hidden="true" />
                    <div className={`${styles.orbit} ${styles.orbit_outer}`} aria-hidden="true">
                        <span className={styles.satellite} />
                    </div>
                    <div className={`${styles.orbit} ${styles.orbit_inner}`} aria-hidden="true">
                        <span className={styles.satellite} />
                    </div>
                    <img
                        ref={photoRef}
                        id={styles.photo}
                        src="/assets/mikimain.png"
                        alt="Mikaela Olarte smiling with arms crossed, surrounded by doodles of a moon, a rocket and a shooting star"
                    />
                </div>
            </section>

            <section
                id="mission"
                ref={missionRef}
                className={`section ${styles.mission}`}
                style={{ "--count": WORD_COUNT }}
            >
                <p className={styles.section_label}>
                    <span aria-hidden="true">✦</span> what I stand for
                </p>
                <blockquote id={styles.hmw}>
                    {HOW_MIGHT_WE.map((segment) => (
                        <span key={segment.text} className={segment.highlight ? styles.highlight : undefined}>
                            {segment.text.split(" ").map((word, index) => (
                                <span
                                    key={index}
                                    className={styles.word}
                                    style={{ "--i": wordIndex++ }}
                                >
                                    {word}{" "}
                                </span>
                            ))}
                        </span>
                    ))}
                </blockquote>
                <p id={styles.mission_note}>
                    It's the question behind every project I take on, and the reason I started
                    Women in Business and Technology.
                </p>
            </section>

            <section
                ref={exploreRef}
                className={`section ${styles.explore} ${exploreVisible ? styles.visible : ""}`}
            >
                <p className={styles.section_label}>
                    <span aria-hidden="true">✦</span> pick a planet to explore
                </p>
                <ul id={styles.destinations}>
                    {DESTINATIONS.map((destination, index) => {
                        const content = (
                            <>
                                <div className={`${styles.planet} ${styles[destination.planet]}`} aria-hidden="true" />
                                <h2>{destination.name}</h2>
                                <p>{destination.blurb}</p>
                                <span className={styles.destination_cta}>
                                    {destination.to ? <>Launch <span aria-hidden="true">→</span></> : "Landing soon"}
                                </span>
                            </>
                        );

                        return (
                            <li key={destination.name} style={{ "--i": index }}>
                                {destination.to ? (
                                    <Link to={destination.to} className={`${styles.destination} glass_bg`}>
                                        {content}
                                    </Link>
                                ) : (
                                    <div className={`${styles.destination} ${styles.destination_soon} glass_bg`}>
                                        {content}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}

export default Home;
