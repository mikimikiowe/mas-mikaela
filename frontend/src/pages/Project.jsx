import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import projects from "@data/projects.json";
import caseStudies from "@data/caseStudies.json";
import styles from "@styles/project.module.css";
import Laptop from "@components/laptop";
import Poster from "@components/poster";
import Video from "@components/video";
import useReveal from "@hooks/useReveal";

// inverted pyramid: what you need to know first, then the details, then the background
const TIERS = [
    { id: "headline", label: "The headline", note: "Need to know" },
    { id: "details", label: "The details", note: "Good to know" },
    { id: "background", label: "Background", note: "Nice to know" },
];

// the top of the page isn't in the JSON sections, so give the rail its own entries for it
function headlineSections(study) {
    const overview = { id: "overview", tier: "headline", eyebrow: "Overview" };
    const preview = { id: "preview", tier: "headline", eyebrow: study.preview.label };
    return study.preview.placement === "top" ? [preview, overview] : [overview, preview];
}

// the work itself: a live site on a laptop, an image as a print, or a video
function Preview({ preview }) {
    if (preview.type === "poster") {
        return <Poster src={preview.src} fullSrc={preview.fullSrc} alt={preview.alt} />;
    }
    if (preview.type === "video") {
        return <Video youtubeId={preview.youtubeId} title={preview.title} />;
    }
    return <Laptop url={preview.url} title={preview.title} />;
}

// distance from the top of the page, ignoring the reveal's slide-in so unrevealed sections measure true
function pageTop(element) {
    let top = 0;
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
    return top;
}

// Highlights the last section whose top has reached the spot just under the sticky nav,
// which is exactly where a reading order link scrolls it to, so even short sections light up.
function useActiveSection(ids) {
    const [active, setActive] = useState(ids[0]);

    useEffect(() => {
        // near the bottom of the page a clicked section can't scroll all the way up, so remember the click
        let clicked = null;

        function update() {
            const line = window.scrollY + parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || 0) + 8;
            let current = ids[0];
            ids.forEach((id) => {
                const element = document.getElementById(id);
                if (element && pageTop(element) <= line) current = id;
            });

            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
            setActive(atBottom && clicked ? clicked : current);
        }

        function handleClick(event) {
            const link = event.target.closest?.('a[href^="#"]');
            const id = link?.getAttribute("href").slice(1);
            if (ids.includes(id)) clicked = id;
        }

        // any scrolling by hand lets the position decide again
        function forgetClick() {
            clicked = null;
        }

        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        window.addEventListener("hashchange", update);
        document.addEventListener("click", handleClick);
        ["wheel", "touchmove", "keydown"].forEach((type) => window.addEventListener(type, forgetClick, { passive: true }));
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
            window.removeEventListener("hashchange", update);
            document.removeEventListener("click", handleClick);
            ["wheel", "touchmove", "keydown"].forEach((type) => window.removeEventListener(type, forgetClick));
        };
    }, [ids]);

    return active;
}

// Lets visitors flip between title typefaces that were tried, with the final pick marked.
function TypeExplorer({ block }) {
    const finalIndex = Math.max(0, block.items.findIndex((item) => item.final));
    const [index, setIndex] = useState(finalIndex);
    const item = block.items[index];

    return (
        <div className={styles.type_explorer}>
            <figure className={styles.type_preview}>
                <img key={item.src} src={item.src} alt={item.alt} />
                <figcaption aria-live="polite">
                    <span className={styles.type_name}>{item.name}</span>
                    {item.final && <span className={styles.type_final}>✦ Final pick</span>}
                    <span className={styles.type_note}>{item.note}</span>
                </figcaption>
            </figure>
            <ul className={styles.type_options} aria-label="Title typeface options">
                {block.items.map((option, optionIndex) => (
                    <li key={option.src}>
                        <button
                            type="button"
                            onClick={() => setIndex(optionIndex)}
                            aria-pressed={optionIndex === index}
                            // the button is named by its typeface, so its preview's description doesn't repeat in the name
                            aria-label={`${option.name}${option.final ? " (final pick)" : ""}`}
                        >
                            <img src={option.src} alt={option.alt} />
                            <span>
                                {option.name}
                                {option.final && <span className={styles.visually_hidden}> (final pick)</span>}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
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
                <ul className={`${styles.list} ${block.columns === 3 ? styles.list_three : ""}`}>
                    {block.items.map((item) => (
                        <li key={item.title}>
                            <h4>{item.title}</h4>
                            <p>{item.text}</p>
                        </li>
                    ))}
                </ul>
            );

        case "image":
            return (
                <figure className={styles.figure}>
                    <img src={block.src} alt={block.alt} loading="lazy" />
                    {block.caption && <figcaption>{block.caption}</figcaption>}
                </figure>
            );

        case "type-explorer":
            return <TypeExplorer block={block} />;

        case "sequence":
            return (
                // focusable so keyboard users can scroll the filmstrip when it overflows on small screens
                <ol className={styles.sequence} tabIndex={0} aria-label={block.label || "Step sequence"}>
                    {block.frames.map((frame, frameIndex) => (
                        <li key={frame.src}>
                            <figure>
                                <span className={styles.sequence_number} aria-hidden="true">{frameIndex + 1}</span>
                                <img src={frame.src} alt={frame.alt} loading="lazy" />
                                <figcaption>
                                    <span className={styles.sequence_title}>{frame.title}</span>
                                    {frame.text}
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ol>
            );

        case "gallery":
            return (
                <div
                    className={[
                        styles.gallery,
                        block.columns === 3 ? styles.gallery_three : "",
                        // drafts and studies show the whole image on paper instead of being cropped
                        block.fit === "contain" ? styles.gallery_contain : "",
                    ].join(" ")}
                >
                    {block.items.map((item) => (
                        <figure key={item.src} className={styles.figure}>
                            {/* focus picks which part of a cropped photo stays in frame */}
                            <img src={item.src} alt={item.alt} loading="lazy" style={item.focus ? { objectPosition: item.focus } : undefined} />
                            {item.caption && <figcaption>{item.caption}</figcaption>}
                        </figure>
                    ))}
                </div>
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

// the fade-in is for scrolling down the page, so a jump from the rail shows its section straight away
function showSectionNow(id) {
    const element = document.getElementById(id);
    if (!element) return;
    element.style.transition = "none";
    element.style.opacity = "1";
    element.style.translate = "0 0";
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
                                            onClick={() => showSectionNow(section.id)}
                                        >
                                            {/* plain section titles make the clearest map; the page's own top parts only have a label */}
                                            {section.title || section.eyebrow}
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

    // name the tab after the project, so screen readers announce which case study opened
    useEffect(() => {
        document.title = `${study ? study.title : "Project"} | Mikaela Olarte`;
    }, [study]);

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

    // the work can lead the page (like a video), or follow the lede
    const previewOnTop = study.preview.placement === "top";
    const previewSection = (
        <section
            id="preview"
            className={`${styles.preview} ${previewOnTop ? styles.preview_top : ""}`}
            aria-label={study.preview.label}
        >
            <Preview preview={study.preview} />
        </section>
    );

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
                                    <Link to="/projects" className={`${styles.back} ${styles.back_top}`}>
                                        <span aria-hidden="true">←</span> All projects
                                    </Link>

                                    {previewOnTop && previewSection}

                                    <header id="overview" className={`${styles.overview} ${previewOnTop ? styles.after_preview : ""}`}>
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

                                    {!previewOnTop && previewSection}
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
