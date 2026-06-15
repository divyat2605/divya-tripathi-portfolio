"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import profile from "@/data/profile.json";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "@/styles/projects/spider-noir.module.css";

const TOTAL_FRAMES = 151;
const FRAME_PATH = "/assets/projects/spider-noir";
const RAIN_DROPS = Array.from({ length: 42 }, (_, index) => index);

const chapters = [
    {
        kicker: "Noir City Archive · File 037",
        title: <>Spider-<em>Noir</em></>,
        body: "In 1937, Noir City answers to syndicates, crooked badges, and whispers in the rain. Ben Reilly answers to no one. Behind the mask, a detective follows the clues everyone else is paid to ignore.",
        meta: "Noir City · 1937",
        badge: "Case File Open",
    },
    {
        kicker: "Chapter I · Corruption",
        title: "A City Bought in Silence",
        body: "Every alley keeps a secret. Every office keeps a ledger. When a trail of missing witnesses reaches the highest towers in Noir City, Ben Reilly steps into a conspiracy built to survive the light.",
        meta: "District 06 · Midnight",
    },
    {
        kicker: "Chapter II · The Mask",
        title: "An Urban Legend Walks",
        body: "The fedora. The trench coat. The pale blue eyes seen only for an instant above the rooftops. Criminals call him a rumor. The people he protects know better.",
        meta: "Rooftop Signal Detected",
    },
    {
        kicker: "Chapter III · The Hunt",
        title: "Webs Across the Rain",
        body: "A detective reads the city like evidence: tire marks in wet asphalt, coded messages in the morning paper, a shadow moving one floor too high. Every thread pulls Ben closer to the syndicate at the center of it all.",
        meta: "Syndicate Trace Active",
    },
    {
        kicker: "Chapter IV · Justice",
        title: "The Dark Fights Back",
        body: "Noir City does not need a spotless hero. It needs someone who will walk into its shadows and return with the truth. Tonight, Spider-Noir closes the distance.",
        meta: "Present Day · Storm Warning",
        badge: "The Investigation Continues",
    },
];

const timeline = [
    ["1932", "The Incident", "A sealed railcar arrives beneath Noir City. By sunrise, three witnesses have vanished."],
    ["1934", "The Awakening", "Ben Reilly survives an ambush in the old observatory and wakes with senses sharpened by the dark."],
    ["1935", "First Appearance", "A masked figure interrupts a syndicate exchange. The newspapers call him an urban legend."],
    ["1936", "Rise of the Syndicate", "Four crime houses unite behind a single unseen hand, tightening their grip on every district."],
    ["1937", "Present Day", "A storm rolls in. Ben finds the clue that could bring the whole city into the light."],
];

const villains = [
    ["01", "The Broker", "Information is currency. He owns the exchange rate.", "Black-market intelligence"],
    ["02", "Black Widow", "She leaves no witnesses, only rumors wrapped in silk.", "Syndicate infiltrator"],
    ["03", "The Collector", "Every stolen relic is another piece of a much older puzzle.", "Keeper of forbidden artifacts"],
    ["04", "The Judge", "His courtroom has no jury. His verdicts echo through the docks.", "Architect of fear"],
];

const stats = [
    { value: 5, label: "Open cases" },
    { value: 17, label: "Districts watched" },
    { value: 4, label: "Syndicate heads" },
    { value: 1937, label: "The year justice returned" },
];

const gallery = [
    ["/assets/projects/spider-noir/spider-noir-walking.webp", "Spider-Noir crossing a rain-soaked Noir City street", "Street Level"],
    ["/assets/projects/spider-noir/spider.jpg", "Spider-Noir seated beneath an interrogation lamp", "Interrogation"],
    ["/assets/projects/spider-noir/50.jpg", "Spider-Noir frame sequence still in the city fog", "The Pursuit"],
    ["/assets/projects/spider-noir/65.jpg", "Spider-Noir frame sequence still under blue city light", "After Midnight"],
    ["/assets/projects/spider-noir/138.jpg", "Spider-Noir frame sequence still on patrol", "Last Signal"],
];

function Atmosphere({ lightningRef, spotlightRef }) {
    const rainRef = useRef(null);

    useEffect(() => {
        rainRef.current?.querySelectorAll("span").forEach((drop, index) => {
            drop.style.setProperty("--drop-x", `${(index * 29) % 101}%`);
            drop.style.setProperty("--drop-delay", `${-((index * 0.19) % 2.8)}s`);
            drop.style.setProperty("--drop-speed", `${0.7 + ((index * 7) % 13) / 10}s`);
            drop.style.setProperty("--drop-length", `${48 + ((index * 17) % 90)}px`);
        });
    }, []);

    return (
        <div className={styles.atmosphere} aria-hidden="true">
            <div ref={rainRef} className={styles.rain}>
                {RAIN_DROPS.map((drop) => <span key={drop} />)}
            </div>
            <div className={styles.fog}><span /><span /><span /></div>
            <div ref={lightningRef} className={styles.lightning} />
            <div ref={spotlightRef} className={styles.cursorLight} />
            <div className={styles.grain} />
        </div>
    );
}

function SectionIntro({ eyebrow, title, body }) {
    return (
        <header className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h2>{title}</h2>
            {body && <p className={styles.sectionCopy}>{body}</p>}
        </header>
    );
}

export default function SpiderNoirPage() {
    const pageRef = useRef(null);
    const storyRef = useRef(null);
    const canvasRef = useRef(null);
    const loaderFillRef = useRef(null);
    const progressFillRef = useRef(null);
    const sceneRefs = useRef([]);
    const lightningRef = useRef(null);
    const cursorLightRef = useRef(null);
    const revealRef = useRef(null);
    const gallerySectionRef = useRef(null);
    const galleryTrackRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [loaderDone, setLoaderDone] = useState(false);
    const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));

    const renderProgress = useCallback((value) => {
        setProgress(value);
        if (loaderFillRef.current) loaderFillRef.current.style.transform = `scaleX(${value / 100})`;
    }, []);

    useEffect(() => {
        const page = pageRef.current;
        if (!page) return undefined;

        const cursorX = gsap.quickTo(cursorLightRef.current, "x", { duration: 0.45, ease: "power3.out" });
        const cursorY = gsap.quickTo(cursorLightRef.current, "y", { duration: 0.45, ease: "power3.out" });
        const onPointerMove = (event) => {
            cursorX(event.clientX);
            cursorY(event.clientY);
        };
        const lightning = gsap.timeline({ repeat: -1, repeatDelay: 4.6 });
        lightning
            .to(lightningRef.current, { autoAlpha: 0.45, duration: 0.06 }, 0)
            .to(lightningRef.current, { autoAlpha: 0, duration: 0.12 }, 0.06)
            .to(lightningRef.current, { autoAlpha: 0.22, duration: 0.05 }, 0.35)
            .to(lightningRef.current, { autoAlpha: 0, duration: 0.22 }, 0.4);

        page.addEventListener("pointermove", onPointerMove);
        return () => {
            page.removeEventListener("pointermove", onPointerMove);
            lightning.kill();
        };
    }, []);

    useEffect(() => {
        const story = storyRef.current;
        const canvas = canvasRef.current;
        if (!story || !canvas) return undefined;

        const context = canvas.getContext("2d");
        const images = new Array(TOTAL_FRAMES);
        const frameState = { frame: 0 };
        const sceneNodes = sceneRefs.current;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let mounted = true;
        let loaded = 0;
        let lastFrame = -1;
        let sequenceTween;

        const drawFrame = () => {
            const frame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameState.frame)));
            const image = images[frame];
            if (!image || frame === lastFrame) return;
            lastFrame = frame;
            const width = window.innerWidth;
            const height = window.innerHeight;
            const scale = Math.max(width / image.width, height / image.height) * (width < 768 ? 1.08 : 1.02);
            const drawWidth = image.width * scale;
            const drawHeight = image.height * scale;
            context.clearRect(0, 0, width, height);
            context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
            const shade = context.createLinearGradient(0, 0, width, height);
            shade.addColorStop(0, "rgba(1, 6, 16, .78)");
            shade.addColorStop(0.54, "rgba(1, 6, 16, .12)");
            shade.addColorStop(1, "rgba(1, 6, 16, .86)");
            context.fillStyle = shade;
            context.fillRect(0, 0, width, height);
        };

        const resize = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            lastFrame = -1;
            drawFrame();
        };

        const activateScene = (value) => {
            const active = Math.min(chapters.length - 1, Math.floor(value * chapters.length));
            sceneNodes.forEach((scene, index) => {
                gsap.to(scene, {
                    autoAlpha: index === active ? 1 : 0,
                    y: index === active ? 0 : 30,
                    duration: 0.5,
                    overwrite: true,
                });
            });
            if (progressFillRef.current) progressFillRef.current.style.transform = `scaleX(${value})`;
        };

        const createSequence = () => {
            gsap.set(sceneNodes, { autoAlpha: 0, y: 30 });
            gsap.set(sceneNodes[0], { autoAlpha: 1, y: 0 });
            sequenceTween = gsap.to(frameState, {
                frame: TOTAL_FRAMES - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: story,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.45,
                    onUpdate: ({ progress: scrollProgress }) => {
                        drawFrame();
                        activateScene(scrollProgress);
                    },
                },
            });
            ScrollTrigger.refresh();
        };

        window.addEventListener("resize", resize);
        resize();
        Promise.all(Array.from({ length: TOTAL_FRAMES }, (_, index) => new Promise((resolve) => {
            const image = new window.Image();
            image.onload = () => {
                images[index] = image;
                resolve();
            };
            image.onerror = resolve;
            image.src = `${FRAME_PATH}/${index + 1}.jpg`;
        }).finally(() => {
            loaded += 1;
            if (mounted) renderProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
        }))).then(() => {
            if (!mounted) return;
            resize();
            createSequence();
            setLoading(false);
            window.setTimeout(() => setLoaderDone(true), 700);
        });

        return () => {
            mounted = false;
            window.removeEventListener("resize", resize);
            sequenceTween?.kill();
            gsap.killTweensOf(frameState);
            gsap.killTweensOf(sceneNodes);
        };
    }, [renderProgress]);

    useEffect(() => {
        if (loading) return undefined;

        const ctx = gsap.context(() => {
            const revealNodes = gsap.utils.toArray(`.${styles.reveal}`);

            revealNodes.forEach((node) => {
                gsap.fromTo(
                    node,
                    { autoAlpha: 0, y: 54 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: node,
                            start: "top 84%",
                            once: true,
                        },
                    }
                );
            });

            gsap.fromTo(
                `.${styles.characterImage}`,
                { scale: 1.16 },
                {
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: revealRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.8,
                    },
                }
            );

            const track = galleryTrackRef.current;
            const gallery = gallerySectionRef.current;

            if (track && gallery) {
                gsap.to(track, {
                    x: () =>
                        Math.min(0, window.innerWidth - track.scrollWidth),
                    ease: "none",
                    scrollTrigger: {
                        trigger: gallery,
                        start: "top top",
                        end: () =>
                            `+=${Math.max(
                                track.scrollWidth - window.innerWidth,
                                window.innerWidth
                            )}`,
                        pin: true,
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                    },
                });
            }

            // Stats Counter Animation - Fixed with React state
            stats.forEach((stat, index) => {
                const statElements = document.querySelectorAll(`.${styles.statValue}`);
                const el = statElements[index];

                if (el) {
                    // Store the target value
                    const targetValue = stat.value;

                    // Create scroll trigger for each stat
                    ScrollTrigger.create({
                        trigger: el,
                        start: "top 85%",
                        once: true,
                        onEnter: () => {
                            // Animate using React state
                            let start = 0;
                            const duration = 1500;
                            const step = 16;
                            const increment = targetValue / (duration / step);

                            const timer = setInterval(() => {
                                start += increment;
                                if (start >= targetValue) {
                                    setAnimatedStats(prev => {
                                        const newStats = [...prev];
                                        newStats[index] = targetValue;
                                        return newStats;
                                    });
                                    clearInterval(timer);
                                } else {
                                    setAnimatedStats(prev => {
                                        const newStats = [...prev];
                                        newStats[index] = Math.floor(start);
                                        return newStats;
                                    });
                                }
                            }, step);
                        }
                    });
                }
            });
        }, pageRef);

        return () => ctx.revert();
    }, [loading]);

    return (
        <main ref={pageRef} className={styles.page}>
            <Atmosphere lightningRef={lightningRef} spotlightRef={cursorLightRef} />

            {!loaderDone && (
                <div className={`${styles.loader} ${!loading ? styles.loaderLeaving : ""}`} role="status" aria-live="polite">
                    <p className={styles.eyebrow}>Noir City Archive</p>
                    <h1>Spider-<em>Noir</em></h1>
                    <p>Reconstructing case file 037</p>
                    <div className={styles.loaderTrack}><span ref={loaderFillRef} /></div>
                    <strong>{progress}%</strong>
                </div>
            )}

            <section ref={storyRef} className={styles.story} aria-label="Spider-Noir case file introduction">
                <div className={styles.stage}>
                    <canvas ref={canvasRef} className={styles.canvas} aria-label="Animated Spider-Noir patrol sequence" />
                    <div className={styles.vignette} aria-hidden="true" />
                    <div className={styles.chrome}>
                        <nav className={styles.nav} aria-label="Project navigation">
                            <Link href="/" className={styles.brand}>{profile.name.full}</Link>
                            <span>Noir City · 1937</span>
                        </nav>
                        <div className={styles.scenes}>
                            {chapters.map((chapter, index) => (
                                <article
                                    key={chapter.kicker}
                                    ref={(node) => { sceneRefs.current[index] = node; }}
                                    className={styles.scene}
                                >
                                    {chapter.badge && <span className={styles.badge}>{chapter.badge}</span>}
                                    <p className={styles.eyebrow}>{chapter.kicker}</p>
                                    {index === 0 ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}
                                    <p>{chapter.body}</p>
                                    <small>{chapter.meta}</small>
                                </article>
                            ))}
                        </div>
                        <div className={styles.storyFooter}>
                            <span>Scroll to investigate</span>
                            <div className={styles.progress}><span ref={progressFillRef} /></div>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={revealRef} className={styles.characterReveal}>
                <Image
                    src="/assets/projects/spider-noir/spider-noir-walking.webp"
                    alt="Spider-Noir walking through the fog of Noir City"
                    fill
                    sizes="100vw"
                    className={styles.characterImage}
                />
                <div className={styles.characterShade} />

                <div className={`${styles.characterCopy} ${styles.reveal}`}>
                    <p className={styles.eyebrow}>Character Reveal · Ben Reilly</p>
                    <h2>The city made<br /><em>a detective.</em></h2>
                    <p>Ben Reilly moves through Noir City like a half-remembered story: unseen until the moment the guilty realize they are no longer alone.</p>
                </div>
            </section>

            <section className={styles.timelineSection}>
                <div className={styles.content}>
                    <SectionIntro eyebrow="Evidence Log" title={<>A history written<br /><em>in shadows.</em></>} body="Five years. One unanswered question. Every clue leads back to the night Noir City changed forever." />
                    <ol className={styles.timeline}>
                        {timeline.map(([year, title, copy]) => (
                            <li key={year} className={styles.reveal}>
                                <time>{year}</time><div><h3>{title}</h3><p>{copy}</p></div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className={styles.villainSection}>
                <div className={styles.content}>
                    <div className={styles.eyeGlow} aria-hidden="true"><span /><span /></div>
                    <SectionIntro eyebrow="Persons Of Interest" title={<>Four names.<br /><em>One syndicate.</em></>} body="They built an empire in the city's blind spots. Ben Reilly intends to map every inch of it." />
                    <div className={styles.villainGrid}>
                        {villains.map(([number, name, quote, role]) => (
                            <article key={name} className={`${styles.villainCard} ${styles.reveal}`}>
                                <span>{number}</span><h3>{name}</h3><p>{quote}</p><small>{role}</small>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section ref={gallerySectionRef} className={styles.gallerySection} aria-label="Noir City gallery">
                <div className={styles.galleryHeader}>
                    <p className={styles.eyebrow}>Visual Evidence</p>
                    <h2>Frames from<br /><em>the dark.</em></h2>
                </div>
                <div ref={galleryTrackRef} className={styles.galleryTrack}>
                    {gallery.map(([src, alt, title], index) => (
                        <figure key={src} className={styles.galleryCard}>
                            <Image src={src} alt={alt} fill sizes="(max-width: 767px) 84vw, 58vw" loading="lazy" />
                            <figcaption><span>0{index + 1}</span>{title}</figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            <section className={styles.statsSection}>
                <div className={styles.content}>
                    <SectionIntro eyebrow="Case Dashboard" title={<>The numbers<br /><em>behind the myth.</em></>} />
                    <div className={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <article key={stat.label} className={`${styles.statCard} ${styles.reveal}`}>
                                <strong className={styles.statValue}>
                                    {animatedStats[index]}
                                </strong>
                                <span>{stat.label}</span>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.quoteSection}>
                <blockquote className={styles.reveal}>
                    <p>&ldquo;The truth does not vanish in the dark. It waits for someone willing to look.&rdquo;</p>
                    <cite>Ben Reilly · Case File 037</cite>
                </blockquote>
            </section>

            <footer className={styles.finalCta}>
                <Image src="/assets/projects/spider-noir/spider.jpg" alt="" fill sizes="100vw" loading="lazy" />
                <div className={styles.finalShade} />
                <div className={`${styles.finalContent} ${styles.reveal}`}>
                    <p className={styles.eyebrow}>Noir City Is Calling</p>
                    <h2>The City Never Sleeps. <em>Neither Does Spider-Noir.</em></h2>

                </div>
            </footer>
        </main>
    );
}