import styles from "@styles/about.module.css";
import { useRef } from "react";
import experience from "@data/experience.json";
import skills from "@data/skills.json";
import useScrollProgress from "@hooks/useScrollProgress";

function About() {
    const photoRef = useRef(null);
    const skillsRef = useScrollProgress(0.9, 0.45);
    const experienceRef = useScrollProgress(0.9, 0.4);

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

    return (
        <div className="root_container">
            <section id={styles.hero} className="section">
                <div id={styles.hero_visual} onPointerMove={handleTilt} onPointerLeave={resetTilt}>
                    <div className={styles.nebula} aria-hidden="true" />
                    <div className={`${styles.orbit} ${styles.orbit_outer}`} aria-hidden="true">
                        <span className={styles.satellite} />
                    </div>
                    <div className={`${styles.orbit} ${styles.orbit_inner}`} aria-hidden="true">
                        <span className={styles.satellite} />
                    </div>
                    <span className={`${styles.sparkle} ${styles.sparkle_one}`} aria-hidden="true">✦</span>
                    <span className={`${styles.sparkle} ${styles.sparkle_two}`} aria-hidden="true">✦</span>
                    <span className={`${styles.sparkle} ${styles.sparkle_three}`} aria-hidden="true">✦</span>
                    <img
                        ref={photoRef}
                        id={styles.photo}
                        src="/assets/aboutme.png"
                        alt="A collage of Mikaela: holding up photo booth strips in pixel sunglasses, smiling in a cardigan, alongside two dogs and two cats"
                    />
                </div>

                <div id={styles.hero_text}>
                    <p className={styles.section_label}>
                        <span aria-hidden="true">✦</span> about me
                    </p>
                    <h1 id={styles.title}>Lovely to meet you!</h1>
                    <p className={styles.lead}>
                        I’m Mikaela, a UX/UI designer focused on creating thoughtful, inclusive experiences.
                    </p>
                    <p>
                        Driven by curiosity, I’m always looking to grow and step outside my comfort zone,
                        exploring new ideas, and turning challenges into opportunities. My work is shaped by
                        collaboration and community, where diverse perspectives help me design solutions that
                        are meaningful, accessible, and intentional.
                    </p>
                    <p>
                        I’m especially passionate about accessibility and creating experiences that empower a
                        wider range of users. Alongside my design work, I lead initiatives that support and
                        uplift women in business and technology, building spaces for connection and growth.
                    </p>
                </div>
            </section>

            <section
                ref={skillsRef}
                className={`section ${styles.block}`}
                style={{ "--count": skills.length }}
            >
                <p className={styles.section_label}>
                    <span aria-hidden="true">✦</span> tools I use
                </p>
                <h2>My Skills</h2>
                <ul id={styles.skills_list}>
                    {skills.map((skill, index) => (
                        <li key={skill.name} className={styles.reveal} style={{ "--i": index }}>
                            <div className={`${styles.skill_item} glass_bg`}>
                                <img src={skill.img} alt="" />
                                <p>{skill.name}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <section
                ref={experienceRef}
                className={`section ${styles.block} ${styles.experience}`}
                style={{ "--count": experience.length }}
            >
                <p className={styles.section_label}>
                    <span aria-hidden="true">✦</span> where I’ve been
                </p>
                <h2>My Experience</h2>
                <ul id={styles.experience_list}>
                    {experience.map((exp, index) => (
                        <li key={exp.company} className={styles.reveal} style={{ "--i": index }}>
                            <article className={`${styles.experience_item} glass_bg`}>
                                <img src={exp.img} alt="" />
                                <div className={styles.experience_text}>
                                    <h3>{exp.company}</h3>
                                    <p>{exp.title}</p>
                                </div>
                                <p className={styles.experience_period}>{exp.period}</p>
                            </article>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default About;
