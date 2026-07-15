'use client'

import { useEffect, useRef, useState, Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/ProjectsSection.module.css'

const PROJECTS = profile.projects
const PROJECTS_BASE_IDX = 3
const AUTO_ADVANCE_SEC = 20

export default function ProjectsSection() {
  const sectionRef  = useRef(null)
  const trackRef    = useRef(null)
  const contentRefs = useRef([])
  const bgRefs      = useRef([])
  const progressRef = useRef(null)
  const slideIdxRef = useRef(0)
  const autoTimerRef = useRef(null)
  const scrollTweenRef = useRef(null)
  const navigateRef = useRef(null)
  const [slideIdx, setSlideIdx] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const scroller = document.querySelector('main')
    if (!scroller) return
    const n = PROJECTS.length
    contentRefs.current = contentRefs.current.slice(0, n)
    bgRefs.current      = bgRefs.current.slice(0, n)

    contentRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.set(el, {
        autoAlpha: i === 0 ? 1 : 0,
        y: i === 0 ? 0 : 30,
        zIndex: i === 0 ? 5 : 1,
        overwrite: true,
      })
    })

    const tl = gsap.timeline({ paused: true })

    tl.to(track, {
      xPercent: -((n - 1) / n * 100),
      ease: 'none',
      duration: n - 1,
    }, 0)

    for (let i = 0; i < n - 1; i++) {
      const curr   = contentRefs.current[i]
      const next   = contentRefs.current[i + 1]
      const nextBg = bgRefs.current[i + 1]
      const revealAt = i + 0.44

      if (curr) {
        tl.set(curr, { zIndex: 5, overwrite: true }, i)
        tl.to(curr, {
          autoAlpha: 0,
          y: -40,
          filter: 'blur(6px)',
          duration: 0.22,
          ease: 'power2.in',
          overwrite: true,
        }, i + 0.22)
        tl.set(curr, { zIndex: 1, filter: 'none' }, revealAt)
      }

      if (nextBg) {
        tl.fromTo(nextBg,
          { scale: 1.04 },
          { scale: 1.0, duration: 1.0, ease: 'power2.out' },
          i
        )
      }

      if (next) {
        tl.set(next, { zIndex: 1, autoAlpha: 0, y: 30, overwrite: true }, i)
        tl.set(next, { zIndex: 5 }, revealAt)
        tl.to(next, {
          autoAlpha: 1,
          y: 0,
          duration: 0.18,
          ease: 'power2.out',
          overwrite: true,
        }, revealAt)

        const meta  = next.querySelector(`.${styles.meta}`)
        const title = next.querySelector(`.${styles.title}`)
        const sub   = next.querySelector(`.${styles.subtitle}`)
        const desc  = next.querySelector(`.${styles.desc}`)
        const tags  = next.querySelectorAll(`.${styles.tag}`)
        const btn   = next.querySelector(`.${styles.liveBtn}`)

        if (meta)  tl.fromTo(meta,  { x: -10, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.25, ease: 'power2.out', overwrite: true }, revealAt + 0.03)
        if (title) tl.fromTo(title, { autoAlpha: 0, y: 20 },  { autoAlpha: 1, y: 0, duration: 0.45, ease: 'expo.out', overwrite: true   }, revealAt + 0.06)
        if (sub)   tl.fromTo(sub,   { y: 12, autoAlpha: 0 },  { y: 0, autoAlpha: 1, duration: 0.30, ease: 'power2.out', overwrite: true }, revealAt + 0.12)
        if (desc)  tl.fromTo(desc,  { y: 10, autoAlpha: 0 },  { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out', overwrite: true }, revealAt + 0.16)
        if (tags.length) {
          tl.fromTo(tags,  { y: 6, autoAlpha: 0 },  { y: 0, autoAlpha: 1, duration: 0.25, ease: 'power2.out', stagger: 0.03, overwrite: true }, revealAt + 0.23)
        }
        if (btn)   tl.fromTo(btn,   { y: 8, autoAlpha: 0 },  { y: 0, autoAlpha: 1, duration: 0.30, ease: 'power2.out', overwrite: true }, revealAt + 0.30)
      }
    }

    function isProjectsInView() {
      const scrollTop = scroller.scrollTop
      const sectionTop = section.offsetTop
      const sectionEnd = sectionTop + section.offsetHeight - window.innerHeight
      return scrollTop >= sectionTop - 8 && scrollTop <= sectionEnd + 8
    }

    function clearAutoTimer() {
      autoTimerRef.current?.kill()
      autoTimerRef.current = null
    }

    function scheduleAutoAdvance() {
      clearAutoTimer()
      if (!isProjectsInView() || n <= 1) return

      autoTimerRef.current = gsap.delayedCall(AUTO_ADVANCE_SEC, () => {
        const nextIdx = (slideIdxRef.current + 1) % n
        navigateToProject(nextIdx)
      })
    }

    function navigateToProject(targetIdx) {
      if (targetIdx < 0 || targetIdx >= n) return

      clearAutoTimer()
      scrollTweenRef.current?.kill()

      const targetScroll = (PROJECTS_BASE_IDX + targetIdx) * window.innerHeight
      const targetProgress = n > 1 ? targetIdx / (n - 1) : 0

      scrollTweenRef.current = gsap.to(scroller, {
        scrollTop: targetScroll,
        duration: 1.0,
        ease: 'power3.inOut',
        overwrite: true,
        onUpdate: () => {
          const dist = scroller.scrollTop - section.offsetTop
          const progress = Math.max(0, Math.min(1, dist / ((n - 1) * window.innerHeight)))
          tl.progress(progress)
        },
        onComplete: () => {
          tl.progress(targetProgress)
          slideIdxRef.current = targetIdx
          setSlideIdx(targetIdx)
          if (progressRef.current) {
            gsap.set(progressRef.current, {
              scaleX: targetProgress,
              transformOrigin: 'left center',
              overwrite: true,
            })
          }
          scheduleAutoAdvance()
        },
      })
    }

    const st = ScrollTrigger.create({
      trigger:  section,
      scroller,
      start:    'top top',
      end:      () => `+=${(n - 1) * window.innerHeight}`,
      onUpdate: (self) => {
        if (scrollTweenRef.current?.isActive()) return

        tl.progress(self.progress)

        const activeIdx = Math.round(self.progress * (n - 1))
        if (slideIdxRef.current !== activeIdx) {
          slideIdxRef.current = activeIdx
          setSlideIdx(activeIdx)
          scheduleAutoAdvance()
        }

        if (progressRef.current) {
          gsap.set(progressRef.current, {
            scaleX: self.progress, transformOrigin: 'left center', overwrite: true,
          })
        }
      },
      onEnter: () => scheduleAutoAdvance(),
      onEnterBack: () => scheduleAutoAdvance(),
      onLeave: () => clearAutoTimer(),
      onLeaveBack: () => clearAutoTimer(),
    })

    navigateRef.current = navigateToProject

    return () => {
      clearAutoTimer()
      scrollTweenRef.current?.kill()
      st.kill()
      navigateRef.current = null
    }
  }, [])

  function handleCounterClick(idx) {
    if (idx === slideIdx) return
    navigateRef.current?.(idx)
  }

  return (
    <div style={{ height: `${PROJECTS.length * 100}vh` }}>
      <section ref={sectionRef} className={styles.section}>

        {/* Top bar */}
        <div className={styles.topBar}>
          <span className={styles.sectionLabel}>Projects</span>
          <Link href="/projects" className={styles.viewAllBtn}>
            <span>View All Projects</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <div className={styles.counter}>
            {PROJECTS.map((_, i) => (
              <Fragment key={i}>
                {i > 0 && <span className={styles.cSep}> / </span>}
                <button
                  type="button"
                  className={i === slideIdx ? styles.cCur : styles.cJump}
                  onClick={() => handleCounterClick(i)}
                  aria-label={`Go to project ${i + 1}`}
                  aria-current={i === slideIdx ? 'true' : undefined}
                >
                  0{i + 1}
                </button>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className={styles.track}
          style={{ width: `${PROJECTS.length * 100}vw` }}
        >
          {PROJECTS.map((proj, i) => (
            <div key={proj.id} className={styles.slide}>

              <div
                ref={el => { bgRefs.current[i] = el }}
                className={styles.slideBg}
              >
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  quality={100}
                  sizes="100vw"
                  className={styles.slideImg}
                  priority={i === 0}
                />
                <div className={styles.slideOverlayLeft}   aria-hidden />
                <div className={styles.slideOverlayBottom} aria-hidden />
                <div className={styles.slideVignette}      aria-hidden />
              </div>

              <span className={styles.slideNum} aria-hidden>0{i + 1}</span>

              <div
                ref={el => { contentRefs.current[i] = el }}
                className={styles.slideContent}
              >
                <div className={styles.slideLeft}>
                  <div className={styles.meta}>
                    <span className={styles.typeTag}>{proj.type}</span>
                  </div>
                  <h2 className={styles.title}>{proj.title}</h2>
                  <p  className={styles.subtitle}>{proj.subtitle}</p>
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.liveBtn}
                  >
                    <span>Live Demo</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>

                <div className={styles.slideRight}>
                  <p className={styles.desc}>{proj.desc}</p>
                  <div className={styles.stack}>
                    {proj.tech.map(t => (
                      <span key={t} className={styles.tag}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className={styles.bottomUI}>
          <div className={styles.progressTrack}>
            <div ref={progressRef} className={styles.progressBar} />
          </div>
        </div>

      </section>
    </div>
  )
}
