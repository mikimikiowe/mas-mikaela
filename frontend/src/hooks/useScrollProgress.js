import { useEffect, useRef } from "react";

// Writes a --progress (0 to 1) custom property onto the element as it scrolls through the viewport.
// 0 when its top reaches `start` of the viewport height, 1 when it reaches `end`.
// It only ever goes up, so content that has been revealed stays revealed.
function useScrollProgress(start = 0.85, end = 0.35) {
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let progress = 0;
        let frame = 0;

        function update() {
            frame = 0;
            const top = element.getBoundingClientRect().top;
            const viewport = window.innerHeight;
            const current = (viewport * start - top) / (viewport * (start - end));
            const next = Math.min(Math.max(current, progress), 1);

            if (next !== progress) {
                progress = next;
                element.style.setProperty("--progress", progress);
            }
        }

        function handleScroll() {
            if (!frame) frame = requestAnimationFrame(update);
        }

        element.style.setProperty("--progress", 0);
        update();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [start, end]);

    return ref;
}

export default useScrollProgress;
