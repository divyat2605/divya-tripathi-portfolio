'use client'

import { useEffect, useRef, Fragment } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FaGithub, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { FiArrowUpRight } from 'react-icons/fi'
import { gsap } from '@/lib/gsap'

import profile from '@/data/profile.json'
import content from '@/data/content.json'
import styles from '@/styles/sections/HeroSection.module.css'

const HeroBackground = dynamic(() => import('@/components/three/HeroBackground'), { ssr: false })

const SOCIAL_ICON_MAP = { GitHub: FaGithub, LinkedIn: FaLinkedinIn, Instagram: FaInstagram }
const SIDEBAR_LABELS  = ['Instagram', 'GitHub', 'LinkedIn']

function splitTagline(text, highlight) {
  if (!highlight) return [text]
  const parts = text.split(highlight)
  return parts.reduce((acc, part, i) => {
    acc.push(part)
    if (i < parts.length - 1) {
      acc.push(<span key={i} className={styles.taglineAccent}>{highlight}</span>)
    }
    return acc
  }, [])
}

export default function HeroSection() {
  const sectionRef     = useRef(null)
  const greetRef       = useRef(null)
  const roleRef        = useRef(null)
  const firstName      = useRef(null)
  const lastName       = useRef(null)
  const photoRef       = useRef(null)
  const pillsRef       = useRef(null)
  const ctaBtnRef      = useRef(null)
  const statsRef       = useRef(null)
  const taglineCardRef = useRef(null)
  const availCardRef   = useRef(null)
  const socialRef      = useRef(null)

  function handleViewProjects() {
    const scroller = document.querySelector('main')
    if (scroller) {
      gsap.to(scroller, { scrollTop: 3 * window.innerHeight, duration: 1.0, ease: 'power3.inOut' })
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const fadeY = [
      greetRef.current, roleRef.current,
      firstName.current, lastName.current,
      pillsRef.current, ctaBtnRef.current, statsRef.current,
    ].filter(Boolean)

    const fadeX = [taglineCardRef.current, availCardRef.current].filter(Boolean)

    gsap.set(fadeY, { opacity: 0, y: 30 })
    gsap.set(fadeX, { opacity: 0, x: 20 })
    if (photoRef.current)  gsap.set(photoRef.current,  { opacity: 0, x: 80 })
    if (socialRef.current) gsap.set(socialRef.current, { opacity: 0, x: -20 })

    const tl = gsap.timeline({ paused: true })
    tl.to(greetRef.current,       { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' })
      .to(roleRef.current,        { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.3')
      .to(firstName.current,      { opacity: 1, y: 0, duration: 0.6,  ease: 'power2.out' }, '-=0.2')
      .to(lastName.current,       { opacity: 1, y: 0, duration: 0.6,  ease: 'power2.out' }, '-=0.4')
      .to(photoRef.current,       { opacity: 1, x: 0, duration: 0.7,  ease: 'power2.out' }, '-=0.5')
      .to(pillsRef.current,       { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.3')
      .to(ctaBtnRef.current,      { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' }, '-=0.2')
      .to(statsRef.current,       { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.2')
      .to(taglineCardRef.current, { opacity: 1, x: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.5')
      .to(availCardRef.current,   { opacity: 1, x: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.3')
      .to(socialRef.current,      { opacity: 1, x: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.4')

    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { tl.play(); observer.disconnect() } },
      { threshold: 0.3 },
    )
    observer.observe(section)
    return () => { observer.disconnect(); tl.kill() }
  }, [])

  const sidebarSocials = SIDEBAR_LABELS
    .map(label => profile.socials.find(s => s.label === label))
    .filter(Boolean)

  return (
    <section ref={sectionRef} className={styles.section}>

      <HeroBackground />

      {/* Photo */}
      <div ref={photoRef} className={styles.photo}>
        <Image
          src="/assets/hero.png" alt={profile.name.full}
          fill priority quality={100}
          sizes="(min-width: 768px) 55vw, 100vw"
          className={styles.photoImg}
        />
      </div>

      {/* Social Sidebar */}
      <div ref={socialRef} className={styles.socialSidebar}>
        {sidebarSocials.map(social => {
          const Icon = SOCIAL_ICON_MAP[social.label]
          if (!Icon) return null
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label={social.label}
            >
              <Icon size={15} />
              <span className={styles.socialLabel}>{social.label}</span>
            </a>
          )
        })}
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollText}>Scroll down</span>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="7" cy="6" r="2" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Left Content Column */}
      <div className={styles.content}>

        {/* Greeting */}
        <div className={styles.greeting}>
          <p ref={greetRef} className={styles.greetText}>{"Hi, I'm"}</p>
          <p ref={roleRef}  className={styles.roleText}>{profile.roles.short}</p>
        </div>

        {/* Stacked Name */}
        <div className={styles.nameBlock}>
          <p ref={firstName} className={styles.name}>{profile.name.first}</p>
          <p ref={lastName}  className={styles.name}>{profile.name.last}</p>
        </div>

        {/* Tag Pills */}
        <div ref={pillsRef} className={styles.pills}>
          {content.hero.pills.map((tag, i) => (
            <Fragment key={tag}>
              <span className={styles.pill}>{tag}</span>
              {i < content.hero.pills.length - 1 && (
                <span className={styles.pillDot} aria-hidden="true" />
              )}
            </Fragment>
          ))}
        </div>

        {/* View Projects CTA */}
        <button ref={ctaBtnRef} type="button" className={styles.viewBtn} onClick={handleViewProjects}>
           View Projects <FiArrowUpRight />
        </button>

        {/* Stats Row */}
        <div ref={statsRef} className={styles.stats}>
          {[...profile.stats.slice(0, 2), content.hero.specialistStat].map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Tagline + Availability Cards */}
      <div className={styles.cardsCol}>
        <div ref={taglineCardRef} className={styles.taglineCard}>
          <p className={styles.taglineText}>
            {splitTagline(profile.tagline, content.hero.taglineHighlight)}
          </p>
          <p className={styles.freelanceNote}>{content.hero.freelanceNote}</p>
        </div>

        {profile.available && (
          <div ref={availCardRef} className={styles.availCard}>
            <div className={styles.availHeader}>
              <span className={styles.availDot} />
              <span className={styles.availStatus}>{content.hero.availableLabel}</span>
            </div>
            <p className={styles.locationLine}>Based in {profile.location.based}</p>
            <p className={styles.locationLine}>Available {profile.location.availability}</p>
          </div>
        )}
      </div>

    </section>
  )
}
