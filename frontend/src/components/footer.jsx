import styles from "@styles/footer.module.css";
import { Link } from "react-router-dom";

// line icons drawn on one 24px grid so they share a stroke weight and pick up the link color
const icons = {
    linkedin: (
        <>
            <rect x="3" y="3" width="18" height="18" rx="4.5" />
            <path d="M8 10.5V16" />
            <circle cx="8" cy="7.5" r="0.4" fill="currentColor" />
            <path d="M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3" />
        </>
    ),
    instagram: (
        <>
            <rect x="3" y="3" width="18" height="18" rx="5.5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.25" cy="6.75" r="0.4" fill="currentColor" />
        </>
    ),
    youtube: (
        <>
            <rect x="2.5" y="5.5" width="19" height="13" rx="4.5" />
            <path d="M10.5 9.5l4 2.5-4 2.5z" fill="currentColor" />
        </>
    ),
    email: (
        <>
            <rect x="3" y="5.5" width="18" height="13" rx="3.5" />
            <path d="M4.5 8l7.5 5 7.5-5" />
        </>
    ),
};

function Icon({ name }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {icons[name]}
        </svg>
    );
}

function Footer() {
    return (
        <footer id={styles.footer} className="glass_bg" aria-label="Footer">
            <nav id={styles.footer_nav} aria-label="Footer">
                <Link to="/" id={styles.logo_link}>
                    <img src="/assets/logo.svg" alt="Más Mikaela home" />
                    <p>Designed by Mikaela Olarte</p>
                </Link>

                <ul id={styles.nav_list} aria-label="Social media">
                    <li className={styles.nav_item}>
                        <Link to="https://www.linkedin.com/in/mikaela-olarte/" aria-label="LinkedIn (opens in a new tab)" target="_blank" rel="noopener noreferrer">
                            <Icon name="linkedin" />
                        </Link>
                    </li>
                    <li className={styles.nav_item}>
                        <Link to="https://www.instagram.com/masmikaela.design/" aria-label="Instagram (opens in a new tab)" target="_blank" rel="noopener noreferrer">
                            <Icon name="instagram" />
                        </Link>
                    </li>
                    <li className={styles.nav_item}>
                        <Link to="https://www.youtube.com/@masmikaela" aria-label="YouTube (opens in a new tab)" target="_blank" rel="noopener noreferrer">
                            <Icon name="youtube" />
                        </Link>
                    </li>
                    <li className={styles.nav_item}>
                        <Link
                            to="mailto:masmikaelaolarte@gmail.com"
                            aria-label="Email Mikaela"
                        >
                            <Icon name="email" />
                        </Link>
                    </li>
                </ul>
            </nav>
        </footer>
    );
}

export default Footer;
