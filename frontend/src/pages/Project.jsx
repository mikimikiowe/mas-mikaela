import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import projects from "@data/projects.json";
import caseStudies from "@data/caseStudies.json";
import styles from "@styles/project.module.css";
import Laptop from "@components/laptop";
import Poster from "@components/poster";
import useReveal from "@hooks/useReveal";

// inverted pyramid: what you need to know first, then the details, then the background
const TIERS = [
    { id: "headline", label: "The headline", note: "Need to know" },
    { id: "details", label: "The details", note: "Good to know" },
    { id: "background", label: "Background", note: "Nice to know" },
];

// the top of the page isn't in the JSON sections, so give the rail its own entries for it
function headlineSections(study) {
    return [
        { id: "overview", tier: "headline", eyebrow: "Overview" },
        { id: "preview", tier: "headline", eyebrow: study.preview.label },
    ];
}

// the work itself: a live site on a laptop, or an image as a print
function Preview({ preview }) {
    if (preview.type === "poster") {
        return <Poster src={preview.src} fullSrc={preview.fullSrc} alt={preview.alt} />;
    }
    return <Laptop url={preview.url} title={preview.title} />;
}

// Highlights the section currently in the middle of the screen.
function useActiveSection(ids) {
    const [active, setActive] = useState(ids[0]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible) setActive(visible.target.id);
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );

        ids.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });
        return () => observer.disconnect();
    }, [ids]);

    return active;
}

function Block({ block }) {
    switch (block.type) {
        case "quote":
            return <blockquote className={styles.quote}>“{block.text}”</blockquote>;

        case "table":
            return (
                <div className={styles.table_wrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {block.columns.map((column) => (
                                    <th key={column} scope="col">{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((row) => (
                                <tr key={row[0]}>
                                    {row.map((cell, index) =>
                                        index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={cell}>{cell}</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        case "fields":
            return (
                <ul className={styles.fields} aria-label="Event fields">
                    {block.items.map((field) => (
                        <li key={field.name}>
                            <span className={styles.field_name}>{field.name}</span>
                            <span className={styles.field_note}>{field.note}</span>
                        </li>
                    ))}
                </ul>
            );

        case "facets":
            return (
                <div className={styles.facets}>
                    {block.items.map((facet) => (
                        <div key={facet.name} className={styles.facet}>
                            <h4>{facet.name}</h4>
                            <p className={styles.facet_question}>{facet.question}</p>
                            <ul>
                                {facet.values.map((value) => (
                                    <li key={value}>{value}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            );

        case "flow":
            return (
                <ol className={styles.flow}>
                    {block.steps.map((step, index) => (
                        <li key={step.name} style={{ "--step": index, "--steps": block.steps.length }}>
                            <span className={styles.flow_name}>{step.name}</span>
                            <span className={styles.flow_note}>{step.note}</span>
                        </li>
                    ))}
                </ol>
            );

        case "list":
            return (
                <ul className={styles.list}>
                    {block.items.map((item) => (
                        <li key={item.title}>
                            <h4>{item.title}</h4>
                            <p>{item.text}</p>
                        </li>
                    ))}
                </ul>
            );

        case "code":
            return (
                <pre className={styles.code}>
                    <code>{block.lines.join("\n")}</code>
                </pre>
            );

        default:
            return <p className={styles.text}>{block.text}</p>;
    }
}

function Section({ section }) {
    const [ref, visible] = useReveal(0.15);

    return (
        <section
            ref={ref}
            id={section.id}
            className={`${styles.section} ${visible ? styles.visible : ""}`}
            aria-labelledby={`${section.id}-title`}
        >
            <p className={styles.eyebrow}>{section.eyebrow}</p>
            <h3 id={`${section.id}-title`}>{section.title}</h3>
            {section.blocks.map((block, index) => (
                <Block key={index} block={block} />
            ))}
        </section>
    );
}

function Rail({ sections, active }) {
    return (
        <nav className={styles.rail} aria-label="On this page">
            <p className={styles.rail_title}>Reading order</p>
            <ol>
                {TIERS.map((tier, index) => (
                    <li key={tier.id} style={{ "--tier": index }}>
                        <span className={styles.rail_band}>{tier.note}</span>
                        <ul>
                            {sections
                                .filter((section) => section.tier === tier.id)
                                .map((section) => (
                                    <li key={section.id}>
                                        <a
                                            href={`#${section.id}`}
                                            aria-current={active === section.id ? "location" : undefined}
                                        >
                                            {section.eyebrow}
                                        </a>
                                    </li>
                                ))}
                        </ul>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

function Project() {
    const { id } = useParams();
    const project = projects.find((item) => item.id === id);
    const study = caseStudies[id];

    const sections = useMemo(() => (study ? [...headlineSections(study), ...study.sections] : []), [study]);
    const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);
    const active = useActiveSection(sectionIds);

    if (!study) {
        return (
            <div className={`root_container ${styles.case_study}`}>
                <section className={`section ${styles.missing}`}>
                    <Link to="/projects" className={styles.back}>
                        <span aria-hidden="true">←</span> All projects
                    </Link>
                    <h1>{project ? project.name : "Project not found"}</h1>
                    <p>This case study is still on its way. Check back soon!</p>
                </section>
            </div>
        );
    }

    return (
        <div className={`root_container ${styles.case_study}`}>
            <div className={`section ${styles.layout}`}>
                <Rail sections={sections} active={active} />

                <article className={styles.content}>
                    {TIERS.map((tier) => (
                        <div key={tier.id} className={styles.tier}>
                            {tier.id !== "headline" && (
                                <h2 className={styles.tier_label}>
                                    <span>{tier.label}</span>
                                </h2>
                            )}

                            {tier.id === "headline" ? (
                                <>
                                    <header id="overview" className={styles.overview}>
                                        <Link to="/projects" className={styles.back}>
                                            <span aria-hidden="true">←</span> All projects
                                        </Link>
                                        <p className={styles.eyebrow}>{study.eyebrow}</p>
                                        <h1 className={styles.title}>{study.title}</h1>
                                        <p className={styles.lede}>{study.lede}</p>

                                        <dl className={styles.facts}>
                                            {study.facts.map((fact) => (
                                                <div key={fact.label}>
                                                    <dt>{fact.label}</dt>
                                                    <dd className={fact.placeholder ? styles.placeholder : ""}>
                                                        {fact.value}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>

                                        <ul className={styles.highlights} aria-label="Highlights">
                                            {study.highlights.map((highlight) => (
                                                <li key={highlight.label}>
                                                    <span className={styles.highlight_value}>{highlight.value}</span>
                                                    <span className={styles.highlight_label}>{highlight.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </header>

                                    <section id="preview" className={styles.preview} aria-label={study.preview.label}>
                                        <Preview preview={study.preview} />
                                    </section>
                                </>
                            ) : (
                                study.sections
                                    .filter((section) => section.tier === tier.id)
                                    .map((section) => <Section key={section.id} section={section} />)
                            )}
                        </div>
                    ))}

                    <Link to="/projects" className={`${styles.back} ${styles.back_bottom}`}>
                        <span aria-hidden="true">←</span> Back to all projects
                    </Link>
                </article>
            </div>
        </div>
    );
}

export default Project;
