import styles from '@styles/header.module.css';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
    const [toggled, setToggled] = useState(false);
    const burgerRef = useRef(null);
    const navRef = useRef(null);

    // let Escape close the menu and hand focus back to the burger
    useEffect(() => {
        if (!toggled) return;

        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                setToggled(false);
                burgerRef.current?.focus();
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [toggled]);

    // share the nav's real height, so in-page links can stop just below it at any screen size
    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        const observer = new ResizeObserver(() => {
            document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
        });
        observer.observe(nav);
        return () => observer.disconnect();
    }, []);

    const closeMenu = () => setToggled(false);

    return (
        <nav ref={navRef} id={styles.nav_container} className='section' aria-label="Main">
            <div id={styles.nav} data-toggled={toggled} className='glass_bg'>
                <Link id={styles.logo_container} to="/" onClick={closeMenu} aria-label="Más Mikaela home">
                    <img id={styles.logo} src="/assets/logo.svg" alt="Más Mikaela logo" />
                </Link>
                <button
                    ref={burgerRef}
                    type="button"
                    className={styles.burger}
                    aria-expanded={toggled}
                    aria-controls="nav_menu"
                    aria-label={toggled ? 'Close menu' : 'Open menu'}
                    onClick={() => setToggled(!toggled)}
                >
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                </button>
                <ul id="nav_menu" className={styles.list}>
                    <li className={styles.list_item}>
                        {/* NavLink marks the current page with aria-current="page" */}
                        <NavLink to="/projects" onClick={closeMenu}>Projects</NavLink>
                    </li>
                    <li className={styles.list_item}>
                        <NavLink to="/about" onClick={closeMenu}>About me</NavLink>
                    </li>
                    <li className={styles.list_item}>
                        <NavLink to="/playground" onClick={closeMenu}>Playground</NavLink>
                    </li>
                </ul>
            </div>
            <div
                className={`${styles.overlay} ${toggled ? styles.active : ''}`}
                aria-hidden="true"
                onClick={closeMenu}
            />
        </nav>
    )
}

export default Navbar;
