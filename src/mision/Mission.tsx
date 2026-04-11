import React from 'react';
import { motion } from 'framer-motion';
import { UseTheme } from '../contexts/ThemeContext';
import './mission.css';

const steps = [
  {
    tag: "01. EL ORIGEN",
    title: "Cerrando la brecha de confianza",
    desc: "Nacemos de una problemática estructural: la dificultad de validar el conocimiento técnico genuino. Eliminamos la incertidumbre del reclutador y el obstáculo del profesional altamente capacitado mediante un estándar de validación único en la industria.",
  },
  {
    tag: "02. ENTRENAMIENTO BAJO FUEGO",
    title: "Real-World Attack Scenarios",
    desc: "No enseñamos solo lógica teórica. Nuestros alumnos se enfrentan a infraestructuras reales y entornos hostiles diseñados para replicar incidentes de seguridad actuales. Aquí, el aprendizaje se forja en la resolución de casos que Juniors, Mids y Seniors enfrentan en su día a día profesional.",
  },
  {
    tag: "03. EVALUACIÓN DE ÉLITE",
    title: "Exámenes de Certificación Técnica",
    desc: "Obtener nuestra certificación no es un trámite; es un logro. Sometemos al alumno a exámenes de alta exigencia donde la única forma de aprobar es demostrando capacidad analítica y técnica ante vectores de ataque y defensa complejos.",
  },
  {
    tag: "04. DESARROLLO PERSONALIZADO",
    title: "Acompañamiento y Mentoring",
    desc: "Entendemos que el desarrollo profesional es una carrera de fondo. Acompañamos el crecimiento del alumno con feedback técnico profundo, asegurando que su evolución sea óptima, realista y alineada con las demandas cambiantes del mercado global de ciberseguridad.",
  },
  {
    tag: "05. EL RESULTADO",
    title: "Garantía de Empleabilidad",
    desc: "Al graduarse, el alumno accede a una bolsa de trabajo exclusiva y de alto renombre. Actuamos como un sello de garantía: las empresas contratan con la certeza absoluta de que el talento posee la experiencia práctica necesaria para proteger sus activos desde el primer día.",
  }
];

const Mission: React.FC = () => {
  const { theme } = UseTheme();

  return (
    <section className={`hc-mission-section ${theme}`}>
      <div className="hc-mission-container">
        
        <header className="hc-mission-header">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hc-mission-main-title"
          >
            NUESTRA <span className="hc-accent">MISIÓN</span>
          </motion.h2>
          <motion.p 
            className="hc-mission-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Redefiniendo el estándar de validación en la industria de la ciberseguridad.
          </motion.p>
        </header>

        <div className="hc-timeline-wrapper">
          {/* Línea central */}
          <div className="hc-timeline-line" />

          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              className="hc-timeline-item"
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
            >
              <div className="hc-timeline-dot">
                <div className="hc-dot-inner" />
              </div>

              <div className={`hc-timeline-content ${idx % 2 === 0 ? 'left' : 'right'}`}>
                <span className="hc-step-tag">{step.tag}</span>
                <h3 className="hc-step-title">{step.title}</h3>
                <p className="hc-step-desc">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission;