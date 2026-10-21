import styles from '@styles/header.module.css';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [toggled, setToggled] = useState(false);
    const burgerRef = useRef(null);

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

    const closeMenu = () => setToggled(false);

    return (
        <nav id={styles.nav_container} className='section' aria-label="Main">
            <div id={styles.nav} data-toggled={toggled} className='glass_bg'>
                <Link id={styles.logo_container} to="/" onClick={closeMenu} aria-label="Más Mikaela home">
                    <img id={styles.logo} src="/assets/logo.svg" alt="" />
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
                        <Link to="/projects" onClick={closeMenu}>PROJECTS</Link>
                    </li>
                    <li className={styles.list_item}>
                        <Link to="/about" onClick={closeMenu}>ABOUT ME</Link>
                    </li>
                    <li className={styles.list_item}>
                        <Link to="/playground" onClick={closeMenu}>PLAYGROUND</Link>
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
