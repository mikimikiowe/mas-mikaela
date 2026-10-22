import Header from "@components/header"
import Footer from "@components/footer"
import Starfield from "@components/starfield"
import { useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"

// each page gets its own tab title, so screen readers announce where you've landed
// (case studies set their own, from their project name)
const TITLES = {
    "/": "Mikaela Olarte | UX/UI Designer",
    "/about": "About me | Mikaela Olarte",
    "/projects": "Projects | Mikaela Olarte",
    "/playground": "Playground | Mikaela Olarte",
};

function BaseLayout() {
    const { pathname } = useLocation();
    const mainRef = useRef(null);
    const previousPath = useRef(pathname);

    // start each new page at the top instead of keeping the last page's scroll position
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });

        if (TITLES[pathname]) document.title = TITLES[pathname];

        // after navigating (not on first load), move focus to the new page's content so screen readers start reading there
        if (previousPath.current !== pathname) {
            previousPath.current = pathname;
            mainRef.current?.focus({ preventScroll: true });
        }
    }, [pathname]);

    return (
        <>
            <a href="#main" className="skip_link">Skip to main content</a>
            {/* lives here so the stars stay put while navigating between pages */}
            <Starfield className="starfield" />
            <Header />
            <main id="main" ref={mainRef} tabIndex={-1}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default BaseLayout;
