import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom_user: "",
    prenom_user: "",
    email_user: "",
    date_naissance: "",
    statut: "",
    etablissement: "",
    gouvernorat: "",
    sexe: "",
    mot_de_passe_user: "",
    confirm_password: "",
    rulesAccepted: false,
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    setMessage("");
    setSuccess(false);

    if (
      !form.nom_user.trim() ||
      !form.prenom_user.trim() ||
      !form.email_user.trim() ||
      !form.date_naissance ||
      !form.statut ||
      !form.etablissement.trim() ||
      !form.gouvernorat ||
      !form.sexe ||
      !form.mot_de_passe_user ||
      !form.confirm_password
    ) {
      setMessage("Veuillez remplir tous les champs");
      return;
    }

    const ageCalcule = calculerAge(form.date_naissance);

    if (ageCalcule < 10 || ageCalcule > 35) {
      setMessage("L'âge doit être entre 10 et 35 ans pour participer");
      return;
    }

    if (form.mot_de_passe_user.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (form.mot_de_passe_user !== form.confirm_password) {
      setMessage("Les mots de passe ne correspondent pas");
      return;
    }

    if (!form.rulesAccepted) {
      setMessage("Vous devez accepter les règles de participation");
      return;
    }

    const payload = {
      nom_user: `${form.nom_user} ${form.prenom_user}`.trim(),
      email_user: form.email_user.trim().toLowerCase(),
      mot_de_passe_user: form.mot_de_passe_user,
      date_naissance: form.date_naissance,
      age: ageCalcule,
      statut: form.statut,
      etablissement: form.etablissement.trim(),
      gouvernorat: form.gouvernorat,
      sexe: form.sexe,
    };

    // ✅ LOG باش تشوف payload فيه إيه
    console.log("📦 PAYLOAD ENVOYÉ:", payload);
    console.log("🔗 URL COMPLÈTE:", "http://localhost:5000/api/auth/register");

    try {
      setLoading(true);

      // ✅ خطوة 1: Register فقط
      const registerRes = await API.post("/auth/register", payload);
      console.log("✅ REGISTER SUCCESS:", registerRes.data);

      // ✅ خطوة 2: نستعملو الـ token اللي رجع من register مباشرة
      // (ما نبعثوش login مرة ثانية)
      localStorage.setItem("token", registerRes.data.token);
      localStorage.setItem("user", JSON.stringify(registerRes.data.user));

      setSuccess(true);
      setMessage("Inscription réussie ! Redirection...");

      // ✅ نستناو شوية قبل نحوّلوا
      setTimeout(() => {
        navigate("/jeune");
      }, 1500);

    } catch (error) {
      console.error("❌ REGISTER ERROR COMPLET:", error);
      console.error("❌ ERROR RESPONSE:", error.response);
      console.error("❌ ERROR RESPONSE DATA:", error.response?.data);
      console.error("❌ ERROR MESSAGE:", error.message);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Erreur inscription"
      );
    } finally {
      setLoading(false);
    }
  };

  const ageAffiche = calculerAge(form.date_naissance);

  return (
    <div className="register-page">
      <div className="register-bg-shape register-shape-top-left"></div>
      <div className="register-bg-shape register-shape-bottom-left"></div>
      <div className="register-bg-shape register-shape-center-right"></div>
      <div className="register-bg-shape register-shape-bottom-right"></div>

      <div className="register-main-layout">
        {/* SIDE GAUCHE */}
        <div className="register-brand-side">
          <div className="register-brand-box">
            <h1>Swafy</h1>
            <p>
              Agence Tunisienne —
              <br />
              Inscription au Débat
            </p>
          </div>
        </div>

        {/* FORMULAIRE */}
        <div className="register-form-side">
          <div className="register-glass-card register-card-large">
            <div className="register-card-overlay"></div>

            <div className="register-logo-title">
              <div className="register-logo-mark">S</div>
              <span>Swafy</span>
            </div>

            <h2>Inscription au Débat Swafy</h2>

            <form onSubmit={handleRegister} className="register-form-grid modern-grid">
              <input
                type="text"
                name="nom_user"
                placeholder="Nom"
                value={form.nom_user}
                onChange={handleChange}
              />

              <input
                type="text"
                name="prenom_user"
                placeholder="Prénom"
                value={form.prenom_user}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email_user"
                placeholder="Email"
                value={form.email_user}
                onChange={handleChange}
              />

              {/* date_naissance + العمر تلقائياً */}
              <div style={{ position: "relative" }}>
                <input
                  type="date"
                  name="date_naissance"
                  value={form.date_naissance}
                  onChange={handleChange}
                  style={{ width: "100%", paddingRight: "80px" }}
                />
                {ageAffiche !== null && (
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "13px",
                      color: "#7c5cbf",
                      fontWeight: "600",
                      background: "#f0edf8",
                      padding: "2px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    {ageAffiche} ans
                  </span>
                )}
              </div>

              <select name="statut" value={form.statut} onChange={handleChange}>
                <option value="">Statut</option>
                <option value="etudiant">Étudiant</option>
                <option value="eleve">Élève</option>
                <option value="lyceen">Lycéen</option>
                <option value="jeune_diplome">Jeune diplômé</option>
              </select>

              <input
                type="text"
                name="etablissement"
                placeholder="Établissement"
                value={form.etablissement}
                onChange={handleChange}
              />

              <select name="gouvernorat" value={form.gouvernorat} onChange={handleChange}>
                <option value="">Gouvernorat</option>
                <option value="Tunis">Tunis</option>
                <option value="Ariana">Ariana</option>
                <option value="Ben Arous">Ben Arous</option>
                <option value="Manouba">Manouba</option>
                <option value="Nabeul">Nabeul</option>
                <option value="Sfax">Sfax</option>
                <option value="Sousse">Sousse</option>
                <option value="Kairouan">Kairouan</option>
              </select>

              {/* SEXE */}
              <div className="gender-group">
                <label className="gender-title">Sexe</label>
                <div className="gender-options">
                  <label>
                    <input
                      type="radio"
                      name="sexe"
                      value="homme"
                      checked={form.sexe === "homme"}
                      onChange={handleChange}
                    />
                    Homme
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="sexe"
                      value="femme"
                      checked={form.sexe === "femme"}
                      onChange={handleChange}
                    />
                    Femme
                  </label>
                </div>
              </div>

              <input
                type="password"
                name="mot_de_passe_user"
                placeholder="Mot de passe"
                value={form.mot_de_passe_user}
                onChange={handleChange}
              />

              <input
                type="password"
                name="confirm_password"
                placeholder="Confirmer le mot de passe"
                value={form.confirm_password}
                onChange={handleChange}
              />

              {/* ACCEPT RULES */}
              <div className="register-rules">
                <input
                  type="checkbox"
                  id="rules"
                  name="rulesAccepted"
                  checked={form.rulesAccepted}
                  onChange={handleChange}
                />
                <label htmlFor="rules">
                  En rejoignant notre débat, vous acceptez les règles de
                  participation et de conduite.
                </label>
              </div>

              <button type="submit" className="register-submit-btn" disabled={loading}>
                {loading ? "Inscription en cours..." : "Rejoindre le débat"}
              </button>
            </form>

            {message && (
              <div className={success ? "register-success-message" : "register-message"}>
                {message}
              </div>
            )}

            <div className="register-login-link">
              Déjà membre ? <Link to="/">Se connecter</Link>
            </div>
          </div>
        </div>

        {/* ESPACE PARENT */}
        <div className="register-parent-side">
          <div className="parent-space-card">
            <h3>Espace Parent</h3>
            <button type="button">Accéder à l'Espace Parent</button>
          </div>
        </div>
      </div>
    </div>
  );
}