import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";

import profile from "@/data/profile.json";
import styles from "@/styles/projects/projects.module.css";

function getProjectUrl(link) {
  try {
    const url = new URL(link);
    return url.pathname.startsWith("/projects/") ? url.pathname : link;
  } catch {
    return link;
  }
}

function MediaLink({ href, children }) {
  const isInternal = href.startsWith("/");

  if (isInternal) {
    return (
      <Link href={href} className={styles.mediaLink}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.mediaLink}
    >
      {children}
    </a>
  );
}

function ProjectAction({ href }) {
  const isInternal = href.startsWith("/");
  const label = "Open Project";

  if (isInternal) {
    return (
      <Link href={href} className={styles.cardAction}>
        <span>{label}</span>
        <FaArrowRight aria-hidden />
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.cardAction}
    >
      <span>{label}</span>
      <FaExternalLinkAlt aria-hidden />
    </a>
  );
}

export default function ProjectsPage() {
  const projects = profile.projects;
  const techCount = new Set(projects.flatMap((project) => project.tech)).size;

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden />

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <FaArrowLeft aria-hidden />
          <span>{profile.name.full}</span>
        </Link>

        <a href={`mailto:${profile.email}`} className={styles.emailLink}>
          Email me
        </a>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Project Archive</p>
          <h1>Selected Projects</h1>
          <p className={styles.lede}>{profile.description}</p>
        </div>

        <div className={styles.metrics} aria-label="Project metrics">
          <div className={styles.metric}>
            <strong>{String(projects.length).padStart(2, "0")}</strong>
            <span>Featured Projects</span>
          </div>
          <div className={styles.metric}>
            <strong>{techCount}+</strong>
            <span>Technologies</span>
          </div>
          <div className={styles.metric}>
            <strong>{profile.stats[0].value}</strong>
            <span>{profile.stats[0].label}</span>
          </div>
        </div>
      </section>

      <section className={styles.grid} aria-label="All projects">
        {projects.map((project, index) => {
          const href = getProjectUrl(project.link);

          return (
            <article key={project.id} className={styles.card}>
              <MediaLink href={href}>
                <span className={styles.cardNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 33vw"
                  className={styles.cardImage}
                  priority={index === 0}
                />
                <span className={styles.mediaShade} aria-hidden />
              </MediaLink>

              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span>{project.type}</span>
                  <span>{project.subtitle}</span>
                </div>

                <h2>{project.title}</h2>
                <p>{project.desc}</p>

                <div className={styles.stack}>
                  {project.tech.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <ProjectAction href={href} />
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
