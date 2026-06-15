import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

import profile from "@/data/profile.json";
import { SITE_URL } from "@/lib/siteConfig";
import styles from "@/styles/legal/legal.module.css";

export const metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for the application owned and operated by ${profile.name.full}.`,
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
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
          <h1>Privacy Policy</h1>
          <p className={styles.meta}>Last Updated: June 2026</p>
        </header>

        <article className={styles.article}>
          <p>
            This application is owned and operated by {profile.name.full}.
          </p>
          <p>
            The application uses Meta and Instagram APIs to manage content,
            comments, messages, and automation workflows for Instagram accounts
            owned or managed by the owner.
          </p>

          <h2>Information We Access</h2>
          <p>The application may access:</p>
          <ul>
            <li>Instagram account information</li>
            <li>Public profile information</li>
            <li>Media content and captions</li>
            <li>Comments and messages</li>
            <li>Account insights and analytics</li>
          </ul>

          <h2>How Information Is Used</h2>
          <p>Information is used solely for:</p>
          <ul>
            <li>Managing Instagram content</li>
            <li>Automating responses to comments and messages</li>
            <li>Analytics and reporting</li>
            <li>Improving automation workflows</li>
          </ul>

          <h2>Data Sharing</h2>
          <p>
            We do not sell, rent, or share personal information with third
            parties.
          </p>

          <h2>Data Security</h2>
          <p>
            Reasonable measures are taken to protect information accessed
            through Meta and Instagram APIs.
          </p>

          <h2>Contact</h2>
          <p>For questions regarding this Privacy Policy, contact:</p>
          <p>
            Email:{" "}
            <a href={`mailto:${profile.email}`} className={styles.link}>
              {profile.email}
            </a>
          </p>

          <h2>Changes</h2>
          <p>
            This Privacy Policy may be updated periodically. Continued use of the
            application constitutes acceptance of any updates.
          </p>
        </article>
      </div>
    </main>
  );
}
