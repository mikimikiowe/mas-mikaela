import { useEffect, useRef, useState } from "react";

// Returns a ref and whether that element has scrolled into view (once).
function useReveal(threshold = 0.25) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            // also reveal if it's already above the viewport, so a fast scroll past it never leaves it hidden
            if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
                setVisible(true);
                observer.disconnect();
            }
        }, { threshold });

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, visible];
}

export default useReveal;
