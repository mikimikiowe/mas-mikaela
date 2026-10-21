import Header from "@components/header"
import Footer from "@components/footer"
import Starfield from "@components/starfield"
import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"

function BaseLayout() {
    const { pathname } = useLocation();

    // start each new page at the top instead of keeping the last page's scroll position
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    return (
        <>
            {/* lives here so the stars stay put while navigating between pages */}
            <Starfield className="starfield" />
            <Header />
            <Outlet  />
            <Footer />
        </>
    );
}

export default BaseLayout;
