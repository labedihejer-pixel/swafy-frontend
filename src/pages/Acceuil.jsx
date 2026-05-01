import { Link } from "react-router-dom";
import styles from "./Accueil.css";
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  FiArrowRight,
  FiClock,
  FiCpu,
  FiShield,
  FiMessageCircle,
  FiZap,
} from "react-icons/fi";

/* ✅ BRAND */
function Brand() {
  return (
    <div className={styles.brand}>
      <div className={styles.brandDot} />
      <span>SWAFY</span>
    </div>
  );
}

/* ✅ HERO SVG */
function HeroIllustration() {
  return (
    <svg
      className={styles.heroSvg}
      viewBox="0 0 520 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="35" y="70" width="280" height="190" rx="18" fill="#ffffff" />
    </svg>
  );
}

/* ✅ MAIN PAGE */
export default function Accueil() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/publications/public")
      .then((res) => setPublications(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page} id="accueil">
      {/* ✅ NAVBAR */}
      <header className={styles.navWrap}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Brand />
            <div className={styles.navActions}>
              <Link to="/register">Register</Link>
              <Link to="/login">Sign in</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ✅ HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>Science With and For Youth</h1>
          <HeroIllustration />
        </div>
      </section>

      {/* ✅ PUBLICATIONS PUBLIC */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Publications récentes</h2>

          {loading && <p>Chargement...</p>}

          {!loading && publications.length === 0 && (
            <p>Aucune publication</p>
          )}

          {publications.map((pub) => (
            <div key={pub.id_publication} className={styles.themeCard}>
              <h3>{pub.titre_publication}</h3>
              <p>{pub.contenu_publication}</p>
              <small>
                Par {pub.nom_user} {pub.prenom_user}
              </small>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <Brand />
          <p>© {new Date().getFullYear()} SWAFY</p>
        </div>
      </footer>
    </div>
  );
}