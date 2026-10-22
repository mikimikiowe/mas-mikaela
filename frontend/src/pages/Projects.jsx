import { Link } from "react-router-dom";
import projects from "@data/projects.json";
import caseStudies from "@data/caseStudies.json";
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
                    Welcome to my world!
                </p>
            </section>

            <section
                ref={listRef}
                className={`section ${styles.projects} ${listVisible ? styles.visible : ""}`}
            >
                <ul id={styles.project_list} aria-label="Projects">
                    {projects.map((project, index) => {
                        const hasCaseStudy = Boolean(caseStudies[project.id]);

                        return (
                        <li key={project.id} style={{ "--i": index }}>
                            <article className={`${styles.project_card} ${hasCaseStudy ? styles.ready : ""} glass_bg`}>
                                <div className={styles.thumbnail} aria-hidden={project.thumbnail ? undefined : "true"}>
                                    {project.thumbnail ? (
                                        <img src={project.thumbnail} alt={project.thumbnailAlt} />
                                    ) : (
                                        <div className={`${styles.planet} ${styles[project.planet]}`} />
                                    )}
                                </div>
                                <div className={styles.card_body}>
                                    <p className={styles.period}>{project.period}</p>
                                    <h2>
                                        {hasCaseStudy ? (
                                            // the link covers the whole card (see .card_link::after)
                                            <Link to={`/projects/${project.id}`} className={styles.card_link}>
                                                {project.name}
                                            </Link>
                                        ) : (
                                            project.name
                                        )}
                                    </h2>
                                    <p className={styles.blurb}>{project.blurb}</p>
                                    <ul className={styles.tags} aria-label="Tags">
                                        {project.tags.map((tag) => (
                                            <li key={tag}>{tag}</li>
                                        ))}
                                    </ul>
                                    <span className={styles.cta}>
                                        {hasCaseStudy ? (
                                            <>Read the case study <span aria-hidden="true">→</span></>
                                        ) : (
                                            "Case study landing soon"
                                        )}
                                    </span>
                                </div>
                            </article>
                        </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}

export default Projects;
