"use client";

import { Box } from "@/ui";
import { useReducedMotion } from "@dreamy-ui/react";
import { useEffect, useRef } from "react";

/**
 * Signal grid backdrop.
 *
 * A single canvas renders a dot matrix where the dots themselves carry the motion:
 * - Data pulses travel along grid rows and columns, lighting dots with a fading tail.
 * - A soft ripple wave periodically expands from the top center through the grid.
 * - Dots near the pointer light up and grow, following the cursor with easing.
 *
 * Colors are resolved from semantic tokens (fg, primary, secondary) at runtime,
 * so the grid follows the theme and color mode automatically.
 */

const SPACING = 26;
const BASE_RADIUS = 1;
const BASE_ALPHA = 0.16;
const CURSOR_RADIUS = 170;
const MAX_PULSES = 7;
const PULSE_SPAWN_MS = 650;
const RIPPLE_INTERVAL_MS = 6500;
const RIPPLE_DURATION_MS = 3800;
const RIPPLE_BAND = 70;
const TAU = Math.PI * 2;

const gridMask = "radial-gradient(ellipse 95% 78% at 50% 0%, black 30%, transparent 100%)";

interface Pulse {
    axis: "row" | "col";
    line: number;
    head: number;
    dir: 1 | -1;
    speed: number;
    length: number;
    tone: 0 | 1;
}

interface Palette {
    fg: string;
    primary: string;
    secondary: string;
}

function readPalette(probe: HTMLElement): Palette {
    const read = (value: string) => {
        probe.style.color = value;
        return getComputedStyle(probe).color;
    };

    return {
        fg: read("var(--colors-fg)"),
        primary: read("var(--colors-primary)"),
        secondary: read("var(--colors-secondary)")
    };
}

export default function HeroBackdrop() {
    const reduceMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const probeRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const probe = probeRef.current;
        if (!canvas || !probe) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const animate = !reduceMotion;

        let palette = readPalette(probe);
        let width = 0;
        let height = 0;
        let cols = 0;
        let rows = 0;
        let offsetX = 0;
        let offsetY = 0;
        let intensity = new Float32Array(0);
        let tone = new Uint8Array(0);

        const pulses: Pulse[] = [];
        const pointer = {
            clientX: -9999,
            clientY: -9999,
            x: -9999,
            y: -9999,
            strength: 0,
            active: false
        };

        let rafId = 0;
        let running = false;
        let isVisible = true;
        let lastTime = 0;
        let lastSpawn = 0;
        let rippleStart = Number.NEGATIVE_INFINITY;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            cols = Math.ceil(width / SPACING) + 1;
            rows = Math.ceil(height / SPACING) + 1;
            offsetX = (width - (cols - 1) * SPACING) / 2;
            offsetY = SPACING / 2;

            intensity = new Float32Array(cols * rows);
            tone = new Uint8Array(cols * rows);
            pulses.length = 0;
        };

        const lineLengthOf = (pulse: Pulse) => (pulse.axis === "row" ? cols : rows);

        const spawnPulse = () => {
            const axis: Pulse["axis"] = Math.random() < 0.6 ? "row" : "col";
            // Bias row pulses toward the top where the grid is most visible.
            const line =
                axis === "row"
                    ? Math.floor(Math.random() * Math.max(1, Math.ceil(rows * 0.6)))
                    : Math.floor(Math.random() * cols);
            const dir: Pulse["dir"] = Math.random() < 0.5 ? 1 : -1;
            const pulse: Pulse = {
                axis,
                line,
                dir,
                head: 0,
                speed: 9 + Math.random() * 10,
                length: 6 + Math.floor(Math.random() * 8),
                tone: Math.random() < 0.7 ? 0 : 1
            };
            pulse.head = dir === 1 ? -1 : lineLengthOf(pulse);
            pulses.push(pulse);
        };

        const draw = (now: number, withEffects: boolean) => {
            intensity.fill(0);

            if (withEffects) {
                for (const pulse of pulses) {
                    const lineLength = lineLengthOf(pulse);
                    const headIndex = Math.floor(pulse.head);

                    for (let k = 0; k < pulse.length; k++) {
                        const pos = headIndex - pulse.dir * k;
                        if (pos < 0 || pos >= lineLength) continue;

                        const idx =
                            pulse.axis === "row" ? pulse.line * cols + pos : pos * cols + pulse.line;
                        const value = (1 - k / pulse.length) ** 1.6;

                        if (value > intensity[idx]) {
                            intensity[idx] = value;
                            tone[idx] = pulse.tone;
                        }
                    }
                }
            }

            const rippleProgress = (now - rippleStart) / RIPPLE_DURATION_MS;
            const rippleActive = withEffects && rippleProgress >= 0 && rippleProgress <= 1;
            const rippleRadius = rippleProgress * Math.hypot(width / 2, height);
            const rippleStrength = (1 - rippleProgress) * 0.5;
            const cursorActive = withEffects && pointer.strength > 0.01;

            ctx.clearRect(0, 0, width, height);

            // Base dot matrix in a single path.
            ctx.globalAlpha = BASE_ALPHA;
            ctx.fillStyle = palette.fg;
            ctx.beginPath();
            for (let j = 0; j < rows; j++) {
                const y = offsetY + j * SPACING;
                for (let i = 0; i < cols; i++) {
                    const x = offsetX + i * SPACING;
                    ctx.moveTo(x + BASE_RADIUS, y);
                    ctx.arc(x, y, BASE_RADIUS, 0, TAU);
                }
            }
            ctx.fill();

            if (!withEffects) {
                ctx.globalAlpha = 1;
                return;
            }

            // Lit dots: pulses, ripple, and pointer glow.
            for (let j = 0; j < rows; j++) {
                const y = offsetY + j * SPACING;
                for (let i = 0; i < cols; i++) {
                    const x = offsetX + i * SPACING;
                    const idx = j * cols + i;
                    let value = intensity[idx];
                    let dotTone = tone[idx];

                    if (rippleActive) {
                        const distance = Math.hypot(x - width / 2, y);
                        const ripple =
                            Math.max(0, 1 - Math.abs(distance - rippleRadius) / RIPPLE_BAND) *
                            rippleStrength;
                        if (ripple > value) {
                            value = ripple;
                            dotTone = 0;
                        }
                    }

                    if (cursorActive) {
                        const distance = Math.hypot(x - pointer.x, y - pointer.y);
                        if (distance < CURSOR_RADIUS) {
                            const glow = (1 - distance / CURSOR_RADIUS) ** 2 * pointer.strength;
                            if (glow > value) {
                                value = glow;
                                dotTone = 0;
                            }
                        }
                    }

                    if (value < 0.03) continue;

                    ctx.globalAlpha = Math.min(1, value * 0.95);
                    ctx.fillStyle = dotTone === 1 ? palette.secondary : palette.primary;
                    ctx.beginPath();
                    ctx.arc(x, y, BASE_RADIUS + value * 1.4, 0, TAU);
                    ctx.fill();
                }
            }

            ctx.globalAlpha = 1;
        };

        const tick = (now: number) => {
            if (!running) return;

            const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
            lastTime = now;

            if (now - lastSpawn > PULSE_SPAWN_MS && pulses.length < MAX_PULSES) {
                spawnPulse();
                lastSpawn = now;
            }

            for (let i = pulses.length - 1; i >= 0; i--) {
                const pulse = pulses[i];
                pulse.head += pulse.dir * pulse.speed * dt;
                const tail = pulse.head - pulse.dir * pulse.length;
                const lineLength = lineLengthOf(pulse);
                if ((pulse.dir === 1 && tail > lineLength) || (pulse.dir === -1 && tail < 0)) {
                    pulses.splice(i, 1);
                }
            }

            if (now - rippleStart > RIPPLE_INTERVAL_MS) {
                rippleStart = now;
            }

            const rect = canvas.getBoundingClientRect();
            const localX = pointer.clientX - rect.left;
            const localY = pointer.clientY - rect.top;
            const inside =
                pointer.active && localX >= 0 && localX <= width && localY >= 0 && localY <= height;

            if (inside && pointer.strength < 0.01) {
                pointer.x = localX;
                pointer.y = localY;
            }
            pointer.x += (localX - pointer.x) * 0.18;
            pointer.y += (localY - pointer.y) * 0.18;
            pointer.strength += ((inside ? 1 : 0) - pointer.strength) * 0.08;

            draw(now, true);
            rafId = requestAnimationFrame(tick);
        };

        const start = () => {
            if (running || !animate) return;
            running = true;
            lastTime = 0;
            rafId = requestAnimationFrame(tick);
        };

        const stop = () => {
            running = false;
            cancelAnimationFrame(rafId);
        };

        const updateRunning = () => {
            if (isVisible && !document.hidden) start();
            else stop();
        };

        const drawStatic = () => {
            if (!running) draw(performance.now(), false);
        };

        const onPointerMove = (event: PointerEvent) => {
            pointer.clientX = event.clientX;
            pointer.clientY = event.clientY;
            pointer.active = true;
        };

        const onPointerLeave = () => {
            pointer.active = false;
        };

        resize();
        drawStatic();

        const resizeObserver = new ResizeObserver(() => {
            resize();
            drawStatic();
        });
        resizeObserver.observe(canvas);

        const intersectionObserver = new IntersectionObserver(([entry]) => {
            isVisible = entry?.isIntersecting ?? true;
            updateRunning();
        });
        intersectionObserver.observe(canvas);

        // Re-resolve token colors when the color mode changes.
        const themeObserver = new MutationObserver(() => {
            palette = readPalette(probe);
            drawStatic();
        });
        themeObserver.observe(document.documentElement, { attributes: true });

        document.addEventListener("visibilitychange", updateRunning);
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onPointerLeave);

        updateRunning();

        return () => {
            stop();
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            themeObserver.disconnect();
            document.removeEventListener("visibilitychange", updateRunning);
            window.removeEventListener("pointermove", onPointerMove);
            document.documentElement.removeEventListener("pointerleave", onPointerLeave);
        };
    }, [reduceMotion]);

    return (
        <Box
            aria-hidden="true"
            h={{ base: "680px", lg: "820px" }}
            left={0}
            overflow={"hidden"}
            pointerEvents={"none"}
            pos={"absolute"}
            right={0}
            top={0}
            w={"full"}
            zIndex={-1}
        >
            {/* Signal grid canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    maskImage: gridMask,
                    WebkitMaskImage: gridMask
                }}
            />

            {/* Hidden probe used to resolve semantic token colors for the canvas */}
            <span
                ref={probeRef}
                style={{ position: "absolute", visibility: "hidden", pointerEvents: "none" }}
            />
        </Box>
    );
}
