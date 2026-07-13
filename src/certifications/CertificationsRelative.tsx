import { useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UseTheme } from "../contexts/ThemeContext";
import { CERTIFICATIONS } from "./Certifications";
import "./certificationsRelative.css";

// ─── DifficultyDots ───────────────────────────────────────────────────────────
function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="cr-difficulty">
      <span className="cr-difficulty-label">DIFICULTAD</span>
      <div className="cr-dots">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`cr-dot ${n <= level ? "cr-dot--filled" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── CertificationsRelative ───────────────────────────────────────────────────
const CertificationsRelative = () => {
  const { certSlug } = useParams();
  const { theme }    = UseTheme();
  const navigate     = useNavigate();

  const cert = CERTIFICATIONS.find((c) => c.slug === certSlug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!cert) return <Navigate to="/certifications" />;

  return (
    <main className={`cr-root ${theme}`}>
      <div className="cr-container">

        {/* ── HERO ── */}
        <section className="cr-hero">
          <div className="cr-hero-text">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="cr-label-mono">// HIDDEN_CERTIFICATION</span>
              <h1 className="cr-massive-title">{cert.name}</h1>
              <p className="cr-subtitle">{cert.subtitle}</p>

              <DifficultyDots level={cert.difficulty} />

              {/* Stats */}
              <div className="cr-stats">
                <div className="cr-stat">
                  <span className="cr-stat-value">{cert.timeLimit}</span>
                  <span className="cr-stat-label">LÍMITE_TIEMPO</span>
                </div>
                <div className="cr-stat">
                  <span className="cr-stat-value">{cert.modules}</span>
                  <span className="cr-stat-label">MÓDULOS</span>
                </div>
                <div className="cr-stat">
                  <span className="cr-stat-value">{cert.questions}</span>
                  <span className="cr-stat-label">PREGUNTAS</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="cr-actions">
                <button
                  className="cr-btn cr-btn--primary"
                  disabled={!cert.active}
                  onClick={() => cert.active && navigate("/checkout/voucher")}
                >
                  ADQUIRIR_VOUCHER [+]
                </button>
                <button
                  className="cr-btn cr-btn--ghost"
                  onClick={() => navigate("/certifications")}
                >
                  ← VOLVER A CERTIFICACIONES
                </button>
              </div>

              {!cert.active && (
                <p className="cr-inactive-notice">
                  // Esta certificación estará disponible próximamente.
                </p>
              )}
            </motion.div>
          </div>

          <div className="cr-hero-img-wrap">
            <img src={cert.img} alt={cert.name} className="cr-hero-img" />
            <div className="cr-hero-img-overlay" />
          </div>
        </section>

        {/* ── INFO GENERAL ── */}
        <section className="cr-section">
          <span className="cr-label-mono">01 // ACERCA_DE_LA_CERTIFICACIÓN</span>
          <h2 className="cr-section-title">¿EN QUÉ CONSISTE?</h2>
          <p className="cr-p">
            La certificación evalúa las competencias prácticas mediante escenarios inspirados en situaciones reales del entorno profesional.
            El examen está estructurado en {cert.modules} módulos con un total de {cert.questions} preguntas, y debe completarse dentro del límite de {cert.timeLimit}.
          </p>
          <p className="cr-p">
            Al aprobar, recibirás el certificado oficial de Hidden Security que podrá ser verificado por empresas a través de nuestra plataforma.
          </p>
        </section>

        {/* ── REQUISITOS ── */}
        <section className="cr-section cr-section--bordered">
          <span className="cr-label-mono">02 // REQUISITOS</span>
          <h2 className="cr-section-title">¿QUIÉN PUEDE RENDIR?</h2>
          <div className="cr-requirements">
            <div className="cr-req-item">
              <span className="cr-req-bullet">▸</span>
              <p>Podés rendir la certificación si contás con un <strong>voucher activo</strong> en tu cuenta.</p>
            </div>
            <div className="cr-req-item">
              <span className="cr-req-bullet">▸</span>
              <p>No es obligatorio haber completado el curso de Hidden Security para rendir, aunque se recomienda como preparación.</p>
            </div>
            <div className="cr-req-item">
              <span className="cr-req-bullet">▸</span>
              <p>El examen debe completarse de forma continua dentro del tiempo límite una vez iniciado.</p>
            </div>
          </div>
        </section>

        {/* ── BOLSA DE TRABAJO ── */}
        <section className="cr-section cr-section--accent">
          <span className="cr-label-mono">03 // EMPLEABILIDAD</span>
          <h2 className="cr-section-title">
            CERTIFICACIÓN Y <span className="cr-accent">BOLSA_HIDDEN</span>
          </h2>
          <p className="cr-p">
            Quienes obtengan la certificación podrán formar parte de la bolsa de talento de Hidden Security,
            donde las empresas identifican perfiles validados para sus procesos de selección.
            Tu certificado quedará vinculado a tu perfil y será visible para las empresas con plan activo.
          </p>

          <div className="cr-cta-block">
            <button
              className="cr-btn cr-btn--primary cr-btn--lg"
              disabled={!cert.active}
              onClick={() => cert.active && navigate("/checkout/voucher")}
            >
              {cert.active ? "ADQUIRIR_VOUCHER [+]" : "PRÓXIMAMENTE"}
            </button>
          </div>
        </section>

      </div>
    </main>
  );
};

export default CertificationsRelative;