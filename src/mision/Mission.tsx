import React from 'react';
import { motion } from 'framer-motion';
import { UseTheme } from '../contexts/ThemeContext';
import './mission.css';

const steps = [
  {
    tag: "01. EL PROBLEMA",
    title: "Reduciendo la brecha entre aprender y demostrar",
    desc: "Muchas personas invierten meses o años formándose, pero siguen encontrando dificultades para demostrar lo que realmente saben hacer. Al mismo tiempo, las empresas reciben cientos de perfiles sin una forma objetiva de validar sus capacidades operativas.",
  },
  {
    tag: "02. VALIDACIÓN BASADA EN ESCENARIOS REALES",
    title: "Demostrar habilidades, no memorizar conceptos",
    desc: "En Hidden Security las evaluaciones se construyen sobre situaciones inspiradas en escenarios reales de ciberseguridad. Buscamos medir cómo una persona analiza, prioriza y toma decisiones, más allá de cuánto contenido pueda recordar.",
  },
  {
    tag: "03. CERTIFICACIONES CON ENFOQUE OPERATIVO",
    title: "Validar la capacidad de actuar",
    desc: "Nuestras certificaciones están diseñadas para evaluar habilidades técnicas y pensamiento analítico aplicado a funciones específicas dentro de la industria. Cada certificación representa una validación práctica del desempeño esperado para ese rol.",
  },
  {
    tag: "04. CRECIMIENTO PROFESIONAL",
    title: "Aprender, validar y evolucionar",
    desc: "La certificación es solo una parte del camino. El objetivo es acompañar el desarrollo profesional mediante formación continua, nuevas certificaciones y una evolución alineada con las necesidades reales del mercado.",
  },
  {
    tag: "05. CONECTANDO TALENTO CON EMPRESAS",
    title: "Generando confianza para ambas partes",
    desc: "Facilitamos el encuentro entre profesionales y organizaciones mediante perfiles con habilidades validadas. No reemplazamos los procesos de selección de las empresas; aportamos una nueva forma de generar confianza antes de la contratación.",
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