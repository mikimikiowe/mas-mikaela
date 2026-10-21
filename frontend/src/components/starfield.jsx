import { useEffect, useRef } from "react";

const STAR_COLOURS = ["255, 255, 255", "226, 214, 255", "255, 214, 240"];
const LINK_DISTANCE = 150;

// Full-screen canvas of twinkling stars that drift with the cursor,
// draw constellation lines near it, and throw the odd shooting star.
function Starfield({ className }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let width = 0;
        let height = 0;
        let stars = [];
        let shootingStar = null;
        let nextShootingStar = performance.now() + 2500;
        let frame = 0;

        const pointer = { x: -9999, y: -9999, active: false };
        const parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.round((width * height) / 5500);
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.4 + 0.3,
                depth: Math.random() * 0.8 + 0.2,
                phase: Math.random() * Math.PI * 2,
                twinkle: Math.random() * 0.002 + 0.0006,
                colour: STAR_COLOURS[Math.floor(Math.random() * STAR_COLOURS.length)],
            }));
        }

        function starPosition(star) {
            return {
                x: star.x + parallax.x * star.depth * 30,
                y: star.y + parallax.y * star.depth * 30,
            };
        }

        function draw(time) {
            ctx.clearRect(0, 0, width, height);

            parallax.x += (parallax.targetX - parallax.x) * 0.05;
            parallax.y += (parallax.targetY - parallax.y) * 0.05;

            const nearby = [];

            for (const star of stars) {
                const { x, y } = starPosition(star);
                const alpha = reduceMotion ? 0.8 : 0.45 + Math.sin(time * star.twinkle + star.phase) * 0.4;

                let radius = star.r;
                if (pointer.active) {
                    const distance = Math.hypot(x - pointer.x, y - pointer.y);
                    if (distance < LINK_DISTANCE) {
                        nearby.push({ x, y, distance });
                        radius += (1 - distance / LINK_DISTANCE) * 1.2;
                    }
                }

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${star.colour}, ${Math.max(alpha, 0.1)})`;
                ctx.fill();
            }

            // Constellation lines from the cursor to nearby stars, and between them
            ctx.lineWidth = 0.8;
            for (let i = 0; i < nearby.length; i++) {
                const a = nearby[i];
                ctx.strokeStyle = `rgba(236, 226, 255, ${(1 - a.distance / LINK_DISTANCE) * 0.55})`;
                ctx.beginPath();
                ctx.moveTo(pointer.x, pointer.y);
                ctx.lineTo(a.x, a.y);
                ctx.stroke();

                for (let j = i + 1; j < nearby.length; j++) {
                    const b = nearby[j];
                    const gap = Math.hypot(a.x - b.x, a.y - b.y);
                    if (gap < 70) {
                        ctx.strokeStyle = `rgba(236, 226, 255, ${(1 - gap / 70) * 0.35})`;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            if (!reduceMotion) drawShootingStar(time);
        }

        function drawShootingStar(time) {
            if (!shootingStar && time > nextShootingStar) {
                shootingStar = {
                    x: Math.random() * width * 0.7 + width * 0.2,
                    y: Math.random() * height * 0.35,
                    vx: -(Math.random() * 6 + 7),
                    vy: Math.random() * 3 + 3,
                    life: 1,
                };
            }
            if (!shootingStar) return;

            const s = shootingStar;
            const tailX = s.x - s.vx * 12;
            const tailY = s.y - s.vy * 12;
            const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${s.life})`);
            gradient.addColorStop(1, "rgba(255, 214, 240, 0)");
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            s.x += s.vx;
            s.y += s.vy;
            s.life -= 0.012;
            if (s.life <= 0 || s.x < -100 || s.y > height + 100) {
                shootingStar = null;
                nextShootingStar = time + Math.random() * 5000 + 3000;
            }
        }

        function loop(time) {
            draw(time);
            frame = requestAnimationFrame(loop);
        }

        function handlePointerMove(event) {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.active = event.pointerType !== "touch";
            parallax.targetX = (event.clientX / width - 0.5) * -2;
            parallax.targetY = (event.clientY / height - 0.5) * -2;
        }

        function handlePointerLeave() {
            pointer.active = false;
        }

        function handleResize() {
            resize();
            if (reduceMotion) draw(0);
        }

        resize();
        window.addEventListener("resize", handleResize);
        if (reduceMotion) {
            draw(0);
        } else {
            window.addEventListener("pointermove", handlePointerMove);
            document.addEventListener("pointerleave", handlePointerLeave);
            frame = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerleave", handlePointerLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

export default Starfield;
