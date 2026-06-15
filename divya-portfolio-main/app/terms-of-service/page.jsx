import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

import profile from "@/data/profile.json";
import { SITE_URL } from "@/lib/siteConfig";
import styles from "@/styles/legal/legal.module.css";

export const metadata = {
  title: "Terms of Service",
  description: `Terms of Service for using the application operated by ${profile.name.full}.`,
  alternates: {
    canonical: `${SITE_URL}/terms-of-service`,
  },
};

export default function TermsOfServicePage() {
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

      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Legal Information</p>
          <h1>Terms of Service</h1>
          <p className={styles.meta}>Last Updated: June 2026</p>
        </header>

        <article className={styles.article}>
          <p>By using this application, you agree to these Terms of Service.</p>

          <h2>Purpose</h2>
          <p>
            This application is designed to manage Instagram content, comments,
            messages, analytics, and automation workflows using Meta&apos;s
            official APIs.
          </p>

          <h2>Acceptable Use</h2>
          <p>Users agree to:</p>
          <ul>
            <li>Comply with Meta Platform Policies</li>
            <li>Comply with Instagram Terms of Use</li>
            <li>Use the application only for lawful purposes</li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            The application is provided &quot;as is&quot; without warranties of any
            kind. The owner shall not be liable for any indirect, incidental,
            or consequential damages arising from use of the application.
          </p>

          <h2>Service Availability</h2>
          <p>
            Features may change, be modified, or be discontinued at any time.
          </p>

          <h2>Contact</h2>
          <p>For support or questions:</p>
          <p>
            Email:{" "}
            <a href={`mailto:${profile.email}`} className={styles.link}>
              {profile.email}
            </a>
          </p>

          <h2>Changes to Terms</h2>
          <p>
            These Terms may be updated from time to time. Continued use of the
            application constitutes acceptance of any revised Terms.
          </p>
        </article>
      </div>
    </main>
  );
}
