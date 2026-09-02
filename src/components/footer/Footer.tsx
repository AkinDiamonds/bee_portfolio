import { Mail } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.metaRow}>
        <p className={styles.quote}>
          &ldquo;This site is haunted by a bee. It&apos;s not a bug, it&apos;s the most important feature.&rdquo;
        </p>

        <nav className={styles.socialLinks} aria-label="Social links">
          <a
            href="https://linkedin.com/in/simeon-akinrinola"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className={styles.socialLink}
          >
            <FaLinkedin aria-hidden="true" />
          </a>
          <a
            href="https://github.com/AkinDiamonds"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className={styles.socialLink}
          >
            <SiGithub aria-hidden="true" />
          </a>
          <a
            href="mailto:simeonakinrinola7@gmail.com"
            aria-label="Email Simeon Akinrinola"
            className={styles.socialLink}
          >
            <Mail aria-hidden="true" />
          </a>
        </nav>
      </div>

      <div id="bee-playground" className={styles.wordmarkStage}>
        <span className={styles.srOnly}>Simeon.</span>
        <span className={styles.wordmark} aria-hidden="true">
          <span>SIME</span>
          <span
            id="bee-landing-pad"
            data-bee-landing-zone="center"
            className={styles.landingPad}
          >
            O
          </span>
          <span>N</span>
          <span className={styles.period} data-bee-accent="true">
            .
          </span>
        </span>
      </div>

      <div className={styles.bottomRow}>
        <p>© {currentYear} Simeon Akinrinola. All rights reserved.</p>
      </div>
    </footer>
  );
}
