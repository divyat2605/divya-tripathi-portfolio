"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import profile from "@/data/profile.json";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "@/styles/projects/tajmahal.module.css";

const TOTAL_FRAMES = 446;
const FRAME_PATH = "/assets/projects/tajmahal";

const chapters = [
    {
        kicker: "Cinematic Monument",
        title: (
            <>
                The <em>Taj</em> Mahal
            </>
        ),
        body: "A scroll-led journey through marble, symmetry, light, and the riverfront presence of India's most iconic wonder.",
        meta: "Agra, India",
    },
    {
        kicker: "First Light",
        title: "Marble In Motion",
        body: "The facade shifts with the day, revealing soft shadows, precise arches, and the quiet geometry of Mughal craft.",
        meta: "Makrana marble",
    },
    {
        kicker: "Central Axis",
        title: "Built On Symmetry",
        body: "Gardens, waterways, minarets, and the mausoleum align into a disciplined composition designed for stillness.",
        meta: "Charbagh plan",
    },
    {
        kicker: "Craft Legacy",
        title: "Hands Of Thousands",
        body: "Stone carvers, calligraphers, masons, inlay artists, and engineers shaped a landmark that still feels impossibly exact.",
        meta: "22,000+ artisans",
    },
    {
        kicker: "River Edge",
        title: "A Wonder That Breathes",
        body: "From the Yamuna banks to the final frame, the monument holds its poise as the world moves around it.",
        meta: "UNESCO heritage",
    },
];

const stats = [
    ["1632", "Construction started"],
    ["UNESCO", "World Heritage Site"],
    ["73m", "Main dome height"],
    ["8M+", "Annual visitors"],
];

const facts = [
    "White marble from Makrana gives the monument its luminous surface.",
    "The minarets lean subtly outward to protect the tomb in an earthquake.",
    "Pietra dura inlay work uses semi-precious stones set into marble.",
];

export default function TajMahalPage() {
    const pageRef = useRef(null);
    const storyRef = useRef(null);
    const canvasRef = useRef(null);
    const loaderFillRef = useRef(null);
    const progressFillRef = useRef(null);
    const sceneRefs = useRef([]);

    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (loaderFillRef.current) {
            loaderFillRef.current.style.width = `${progress}%`;
        }
    }, [progress]);

    useEffect(() => {
        const story = storyRef.current;
        const canvas = canvasRef.current;

        if (!story || !canvas) return undefined;

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        const sceneNodes = sceneRefs.current;
        const images = new Array(TOTAL_FRAMES);
        const imageSequence = { frame: 0 };
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const activeTriggers = [];
        let completedFrames = 0;
        let isMounted = true;
        let lastRenderedFrame = -1;

        const getFramePath = (frameIndex) => `${FRAME_PATH}/${frameIndex + 1}.jpg`;

        const drawFrame = () => {
            const frame = Math.max(
                0,
                Math.min(TOTAL_FRAMES - 1, Math.round(imageSequence.frame))
            );
            const img = images[frame];

            if (!ctx || !img || frame === lastRenderedFrame) return;

            lastRenderedFrame = frame;

            const width = window.innerWidth;
            const height = window.innerHeight;
            const canvasRatio = width / height;
            const imageRatio = img.width / img.height;
            const zoom = width < 768 ? 1.04 : 1;

            let drawWidth;
            let drawHeight;

            if (canvasRatio > imageRatio) {
                drawWidth = width * zoom;
                drawHeight = drawWidth / imageRatio;
            } else {
                drawHeight = height * zoom;
                drawWidth = drawHeight * imageRatio;
            }

            const x = (width - drawWidth) / 2;
            const y = (height - drawHeight) / 2;

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, x, y, drawWidth, drawHeight);

            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, "rgba(3, 7, 18, 0.04)");
            gradient.addColorStop(0.5, "rgba(3, 7, 18, 0.06)");
            gradient.addColorStop(1, "rgba(3, 7, 18, 0.42)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            lastRenderedFrame = -1;
            drawFrame();
        };

        const setActiveScene = (storyProgress) => {
            const sceneIndex = Math.min(
                chapters.length - 1,
                Math.floor(storyProgress * chapters.length)
            );

            sceneNodes.forEach((scene, index) => {
                if (!scene) return;

                gsap.to(scene, {
                    autoAlpha: index === sceneIndex ? 1 : 0,
                    y: index === sceneIndex ? 0 : 18,
                    duration: 0.35,
                    overwrite: true,
                });
            });
        };

        const updateHud = (storyProgress) => {
            if (progressFillRef.current) {
                progressFillRef.current.style.transform = `scaleX(${storyProgress})`;
            }

        };

        const createScrollStory = () => {
            gsap.set(sceneNodes, { autoAlpha: 0, y: 18 });
            gsap.set(sceneNodes[0], { autoAlpha: 1, y: 0 });

            const tween = gsap.to(imageSequence, {
                frame: TOTAL_FRAMES - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: story,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.4,
                    onUpdate: (self) => {
                        drawFrame();
                        setActiveScene(self.progress);
                        updateHud(self.progress);
                    },
                },
            });

            activeTriggers.push(tween.scrollTrigger);
            updateHud(0);
            ScrollTrigger.refresh();
        };

        const preloadFrames = async () => {
            const loaders = Array.from({ length: TOTAL_FRAMES }, (_, index) => {
                return new Promise((resolve) => {
                    const img = new Image();

                    img.onload = () => {
                        images[index] = img;
                        resolve();
                    };

                    img.onerror = resolve;
                    img.src = getFramePath(index);
                }).finally(() => {
                    completedFrames += 1;

                    if (isMounted) {
                        setProgress(Math.round((completedFrames / TOTAL_FRAMES) * 100));
                    }
                });
            });

            await Promise.all(loaders);

            if (!isMounted) return;

            imageSequence.frame = 0;
            resizeCanvas();
            createScrollStory();

           
                setLoading(false);
         
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        preloadFrames();

        return () => {
            isMounted = false;
            activeTriggers.forEach((trigger) => trigger?.kill());
            window.removeEventListener("resize", resizeCanvas);
            gsap.killTweensOf(imageSequence);
            gsap.killTweensOf(sceneNodes);
        };
    }, []);

    return (
        <main ref={pageRef} className={styles.page}>
            {loading && (
                <div className={styles.loader} aria-live="polite">
                    <div className={styles.loaderMark}>TM</div>
                    <p className={styles.loaderKicker}>Preparing the marble journey</p>
                    <h1 className={styles.loaderTitle}>Taj Mahal</h1>
                    <div className={styles.loaderTrack}>
                        <div ref={loaderFillRef} className={styles.loaderFill} />
                    </div>
                    <span className={styles.loaderPct}>{progress}%</span>
                </div>
            )}

            <section ref={storyRef} className={styles.story}>
                <div className={styles.stage}>
                    <canvas
                        ref={canvasRef}
                        className={styles.canvas}
                        aria-label="Animated Taj Mahal image sequence"
                    />

                    <div className={styles.vignette} />

                    <div className={styles.chrome}>
                        <nav className={styles.topBar} aria-label="Taj Mahal story">
                            <Link href="/" className={styles.brand}>
                                {profile.name.full}
                            </Link>
                            <span className={styles.location}>Agra, India</span>
                        </nav>

                        <div className={styles.scenes}>
                            {chapters.map((chapter, index) => (
                                <article
                                    key={chapter.kicker}
                                    ref={(node) => {
                                        sceneRefs.current[index] = node;
                                    }}
                                    className={`${styles.scene} ${index === 0 ? styles.heroScene : styles.chapterScene
                                        }`}
                                >
                                    <p className={styles.kicker}>{chapter.kicker}</p>
                                    {index === 0 ? (
                                        <h1 className={styles.title}>{chapter.title}</h1>
                                    ) : (
                                        <h2 className={styles.title}>{chapter.title}</h2>
                                    )}
                                    <p className={styles.body}>{chapter.body}</p>
                                    <span className={styles.meta}>{chapter.meta}</span>
                                </article>
                            ))}
                        </div>

                        <div className={styles.bottomBar}>
                            <div className={styles.scrollHint}>
                                <span className={styles.scrollLine} />
                                <span>Scroll</span>
                            </div>

                            <div className={styles.progress}>
                                <div className={styles.progressTrack}>
                                    <div ref={progressFillRef} className={styles.progressFill} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <p className={styles.footerKicker}>UNESCO World Heritage Site</p>
                    <h2>
                        Built for <em>eternity</em>, experienced in motion.
                    </h2>

                    <div className={styles.stats}>
                        {stats.map(([value, label]) => (
                            <div key={label} className={styles.stat}>
                                <strong>{value}</strong>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.factGrid} aria-label="Taj Mahal facts">
                        {facts.map((fact, index) => (
                            <p key={fact}>
                                <span>{String(index + 1).padStart(2, "0")}</span>
                                {fact}
                            </p>
                        ))}
                    </div>

                    <p className={styles.footerBody}>
                        Plan your visit, check timings, and explore visitor information
                        through the official Taj Mahal website.
                    </p>

                    <a
                        className={styles.cta}
                        href="https://www.tajmahal.gov.in"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Visit Official Website
                    </a>
                </div>
            </footer>
        </main>
    );
}
