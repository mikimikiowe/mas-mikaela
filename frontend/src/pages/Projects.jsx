import projects from "@data/projects.json";
import styles from "@styles/projects.module.css";
import useReveal from "@hooks/useReveal";

function Projects() {
    const [listRef, listVisible] = useReveal(0.15);

    return (
        <div className="root_container">
            <section id={styles.intro} className="section">
                <p className={styles.section_label}>
                    <span aria-hidden="true">✦</span> my work
                </p>
                <h1 id={styles.title}>Projects</h1>
                <p id={styles.subtitle}>
                    Case studies, hackathons and interactive systems I've designed and built.
                </p>
            </section>

            <section
                ref={listRef}
                className={`section ${styles.projects} ${listVisible ? styles.visible : ""}`}
            >
                <ul id={styles.project_list} aria-label="Projects">
                    {projects.map((project, index) => (
                        <li key={project.id} style={{ "--i": index }}>
                            <article className={`${styles.project_card} glass_bg`}>
                                <div className={styles.thumbnail} aria-hidden="true">
                                    <div className={`${styles.planet} ${styles[project.planet]}`} />
                                </div>
                                <div className={styles.card_body}>
                                    <p className={styles.period}>{project.period}</p>
                                    <h2>{project.name}</h2>
                                    <p className={styles.blurb}>{project.blurb}</p>
                                    <ul className={styles.tags} aria-label="Tags">
                                        {project.tags.map((tag) => (
                                            <li key={tag}>{tag}</li>
                                        ))}
                                    </ul>
                                    <span className={styles.cta}>Case study landing soon</span>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default Projects;
