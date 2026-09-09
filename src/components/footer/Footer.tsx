import { Mail } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import styles from "./Footer.module.css";
import type { SiteProfile } from "@/lib/types";

interface FooterProps {
  profile: SiteProfile | null;
}

export default function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const quote = profile?.footerQuote || "This site is haunted by a bee. It\u2019s not a bug, it\u2019s the most important feature.";
  const github = profile?.githubUrl || "https://github.com/AkinDiamonds";
  const linkedin = profile?.linkedinUrl || "https://linkedin.com/in/simeon-akinrinola";
  const email = profile?.email ? `mailto:${profile.email}` : "mailto:simeonakinrinola7@gmail.com";
  const name = profile?.heroName || "Simeon Akinrinola";
  const firstName = name.trim() ? name.split(" ")[0] : "Simeon";

  return (
    <footer className={styles.footer}>
      <div className={styles.metaRow}>
        <p className={styles.quote}>{quote}</p>
        <nav className={styles.socialLinks} aria-label="Social links">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className={styles.socialLink}
          >
            <FaLinkedin aria-hidden="true" />
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className={styles.socialLink}
          >
            <SiGithub aria-hidden="true" />
          </a>
          <a
            href={email}
            aria-label={`Email ${name}`}
            className={styles.socialLink}
          >
            <Mail aria-hidden="true" />
          </a>
        </nav>
      </div>

      <div id="bee-playground" className={styles.wordmarkStage}>
        <span className={styles.srOnly}>{firstName}.</span>
        <span className={styles.wordmark} aria-hidden="true">
          <span>{firstName.toUpperCase()}</span>
          <span className={styles.period} data-bee-accent="true">
            .
          </span>
        </span>
      </div>

      <div className={styles.bottomRow}>
        <p>© {currentYear} {name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
