import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./JeuneLayout.css";
import "./LiveViewer.css";

export default function JeuneLayout() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activeMenu, setActiveMenu] = useState("Accueil");
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ✅ حساب العمر من date_naissance
  const calculerAge = (dateNaissance) => {
    if (!dateNaissance) return null;
    const aujourdhui = new Date();
    const naissance = new Date(dateNaissance);
    let age = aujourdhui.getFullYear() - naissance.getFullYear();
    const moisDiff = aujourdhui.getMonth() - naissance.getMonth();
    if (
      moisDiff < 0 ||
      (moisDiff === 0 && aujourdhui.getDate() < naissance.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUserData(res.data.user);
      } catch (error) {
        console.error("Erreur récupération user:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="jeune-loading-page">
        <div className="jeune-loading-card">Chargement de l'espace jeune...</div>
      </div>
    );
  }

  // ✅ العمر المحسوب
  const ageUtilisateur = calculerAge(userData?.date_naissance);

  return (
    <div className="jeune-layout">
      {/* SIDEBAR */}
      <aside className="jeune-sidebar">
        <div>
          <div className="jeune-sidebar-logo">
            <div className="logo-circle">S</div>
            <div>
              <h2>Swafy</h2>
              <p>Espace Jeune</p>
            </div>
          </div>

          <ul className="jeune-menu">
            {[
              "Accueil",
              "Publications",
              "Live",
              "Messages",
              "Notifications",
              "Profil",
              "Paramètres",
            ].map((item) => (
              <li
                key={item}
                className={activeMenu === item ? "active" : ""}
                onClick={() => setActiveMenu(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button className="logout-btn" onClick={logout}>
          Déconnexion
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="jeune-main">
        {/* TOPBAR */}
        <div className="jeune-topbar">
          <div>
            <h1>{activeMenu}</h1>
            <p>Bienvenue sur votre espace personnel Swafy</p>
          </div>

          <div className="jeune-user-box">
            <div className="jeune-avatar">
              {userData?.nom_user?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h4>{userData?.nom_user || "Utilisateur"}</h4>
              <span>{userData?.email_user || "-"}</span>
            </div>
          </div>
        </div>

        {/* ACCUEIL */}
        {activeMenu === "Accueil" && (
          <section className="jeune-content">
            <div className="welcome-banner">
              <div>
                <h2>Bienvenue {userData?.nom_user} 👋</h2>
                <p>
                  Votre inscription est validée et vous êtes connecté à votre
                  espace jeune sur SWAFY.
                </p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Profil</h3>
                <p>Compte actif et prêt à être utilisé</p>
              </div>

              <div className="stat-card">
                <h3>Publications</h3>
                <p>Découvrez et partagez vos idées</p>
              </div>

              <div className="stat-card">
                <h3>Live</h3>
                <p>Suivez les débats en direct</p>
              </div>

              <div className="stat-card">
                <h3>Messages</h3>
                <p>Consultez vos échanges avec l'administration</p>
              </div>
            </div>

            <div className="profile-section">
              <h3>Informations personnelles</h3>

              <div className="profile-grid">
                <div className="profile-card">
                  <span>Nom complet</span>
                  <strong>{userData?.nom_user || "-"}</strong>
                </div>

                <div className="profile-card">
                  <span>Email</span>
                  <strong>{userData?.email_user || "-"}</strong>
                </div>

                {/* ✅ date_naissance فقط */}
                <div className="profile-card">
                  <span>Date de naissance</span>
                  <strong>{userData?.date_naissance || "-"}</strong>
                </div>

                {/* ✅ العمر يحسب تلقائياً من date_naissance */}
                <div className="profile-card">
                  <span>Âge</span>
                  <strong>{ageUtilisateur ? `${ageUtilisateur} ans` : "-"}</strong>
                </div>

                <div className="profile-card">
                  <span>Sexe</span>
                  <strong>{userData?.sexe || "-"}</strong>
                </div>

                <div className="profile-card">
                  <span>Statut</span>
                  <strong>{userData?.statut || "-"}</strong>
                </div>

                <div className="profile-card">
                  <span>Établissement</span>
                  <strong>{userData?.etablissement || "-"}</strong>
                </div>

                <div className="profile-card">
                  <span>Gouvernorat</span>
                  <strong>{userData?.gouvernorat || "-"}</strong>
                </div>

                <div className="profile-card">
                  <span>Téléphone</span>
                  <strong>{userData?.tel_user || "-"}</strong>
                </div>

                <div className="profile-card">
                  <span>Rôle</span>
                  <strong>{userData?.role || "-"}</strong>
                </div>

                <div className="profile-card">
                  <span>Statut du compte</span>
                  <strong>{userData?.status_user || "-"}</strong>
                </div>

                <div className="profile-card">
                  <span>ID utilisateur</span>
                  <strong>{userData?.id_user || "-"}</strong>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PUBLICATIONS */}
        {activeMenu === "Publications" && (
          <section className="simple-section-card">
            <h2>Publications</h2>
            <p>Cette section affichera prochainement les publications des jeunes.</p>
          </section>
        )}

        {/* LIVE */}
        {activeMenu === "Live" && (
          <section className="simple-section-card">
            <h2>Live</h2>
            <p>Cette section affichera les débats en direct et les sessions live.</p>
          </section>
        )}

        {/* MESSAGES */}
        {activeMenu === "Messages" && (
          <section className="simple-section-card">
            <h2>Messages</h2>
            <p>Cette section affichera vos messages avec l'administration.</p>
          </section>
        )}

        {/* NOTIFICATIONS */}
        {activeMenu === "Notifications" && (
          <section className="simple-section-card">
            <h2>Notifications</h2>
            <p>Vous trouverez ici toutes vos notifications importantes.</p>
          </section>
        )}

        {/* PROFIL */}
        {activeMenu === "Profil" && (
          <section className="simple-section-card">
            <h2>Mon Profil</h2>
            <p><strong>Nom :</strong> {userData?.nom_user || "-"}</p>
            <p><strong>Email :</strong> {userData?.email_user || "-"}</p>
            <p><strong>Date de naissance :</strong> {userData?.date_naissance || "-"}</p>
            <p><strong>Âge :</strong> {ageUtilisateur ? `${ageUtilisateur} ans` : "-"}</p>
            <p><strong>Sexe :</strong> {userData?.sexe || "-"}</p>
            <p><strong>Statut :</strong> {userData?.statut || "-"}</p>
            <p><strong>Établissement :</strong> {userData?.etablissement || "-"}</p>
            <p><strong>Gouvernorat :</strong> {userData?.gouvernorat || "-"}</p>
            <p><strong>Téléphone :</strong> {userData?.tel_user || "-"}</p>
            <p><strong>Rôle :</strong> {userData?.role || "-"}</p>
            <p><strong>Statut du compte :</strong> {userData?.status_user || "-"}</p>
          </section>
        )}

        {/* PARAMÈTRES */}
        {activeMenu === "Paramètres" && (
          <section className="simple-section-card">
            <h2>Paramètres</h2>
            <p>Cette section permettra de modifier les paramètres du compte plus tard.</p>
          </section>
        )}
      </main>
    </div>
  );
}