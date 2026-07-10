import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UseTheme } from "../contexts/ThemeContext";
import LiveTypingText from "../ui/LiveTypingText";
import "./pricing.css";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
    const { theme } = UseTheme();
    const navigate = useNavigate();
    const [view, setView] = useState<"students" | "business">("students");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePurchase = (planTitle: string) => {
    const planMap: Record<string, string> = {
        "CERTIFICACIÓN INDIVIDUAL": "voucher",
    };
    const planId = planMap[planTitle] ?? planTitle.toLowerCase();
    navigate(`/checkout/${planId}`);
};

    const studentPlans = [
        { title: "STARTER", price: "100.000", desc: "Ideal para comenzar tu formación y desarrollar las habilidades necesarias para iniciar una carrera en ciberseguridad.", period: "3 MESES DISPONIBLES", features: ["Acceso a todos los cursos", "Acceso a futuros cursos publicados", "Certificado de finalización de curso"], label: "01 - TRAINING", cuotas: 3 },
        { title: "PRO", price: "200.000", desc: "La mejor opción para quienes buscan prepararse y validar sus habilidades.",period: "6 MESES DISPONIBLES", features: ["1 Voucher de certificación Hidden Security", "Acceso a todos los cursos", "Acceso a futuros cursos publicados", "Certificado de finalización de curso"], label: "02 - RECOMENDADO", highlight: true, cuotas: 3},
        { title: "ELITE", price: "300.000", desc: "La experiencia más completa para quienes desean aprovechar al máximo el ecosistema de Hidden Security.", period: "12 MESES DISPONIBLES", features: ["Acceso a todos los cursos", "Acceso a futuros cursos publicados", "Certificado de finalización de curso", "Voucher de certificación Hidden Security", "2do Voucher de certificación en caso de no aprobar el primero"], label: "03 - FULL_STACK", cuotas: 3 },
        { title: "CERTIFICACIÓN INDIVIDUAL", desc: "Si ya contás con los conocimientos necesarios, podés rendir la certificación sin necesidad de realizar nuestros cursos.", price: "150.000", period: "UNICO USO", features: ["Un Intento de certificación Hidden Security", "Validación de conocimiento obtenido", "Título de certificacion Hidden Security"], label: "04 - CERTIFICATION", cuotas: 3 }
    ];

    const businessPlans = [
        { 
            title: "BUSINESS", // B2B_SEIS
            price: "900.000", 
            period: "6 MESES",
            desc: "Ideal para empresas que buscan incorporar talento especializado en ciberseguridad.", 
            features: ["Acceso a base de datos de perfiles", "Búsqueda por habilidades, herramientas y certificaciones", "Publicación de ofertas laborales", "Contacto directo con candidatos", "Hasta 10 busquedas activas"],
            label: "01 // BUSINESS",
            cuotas: 3
        },
        { 
            title: "ENTERPRISE", // B2B_DOCE
            price: "1.500.000", 
            period: "12 MESES", 
            desc: "Para organizaciones con procesos de selección continuos.",
            features: ["Todo lo incluído en Business", "Publicaciones ilimitadas", "Busquedas activas ilimitadas", "Soporte prioritario", "Acceso prioritario a nuevas funcionalidades"],
            label: "02 // ENTERPRISE: RECOMENDADO",
            highlight: true,
            cuotas: 3
        }
    ];

    return (
        <main className={`pricing-root ${theme}`}>
            <section className="pricing-container">
                <header className="pricing-header">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="h-label-mono">// ESTRUCTURA_DE_COSTOS</span>
                        <h1 className="h-massive-title Montserrat-900">
                            INVERSIÓN EN <span className="h-outline">CAPACIDAD</span>
                        </h1>
                        <div className="pricing-intro-p">
                            <LiveTypingText text="Selecciona el nodo de acceso que mejor se adapte a tus requerimientos operativos. Todos nuestros planes incluyen acceso a la infraestructura de aprendizaje de Hidden Security." />
                        </div>
                    </motion.div>
                    
                    {/* TOGGLE SWITCH CORPORATIVO */}
                    <div className="pricing-selector-container">
                        <div className="pricing-toggle-wrapper">
                            <button className={`toggle-btn ${view === "students" ? "active" : ""}`} onClick={() => setView("students")}>ESTUDIANTES</button>
                            <button className={`toggle-btn ${view === "business" ? "active" : ""}`} onClick={() => setView("business")}>CORPORATIVO</button>
                            <motion.div 
                                className="toggle-slider"
                                animate={{ x: view === "students" ? "0%" : "100%" }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        </div>
                    </div>
                </header>

                <div className="pricing-grid">
                    <AnimatePresence mode="wait">
                        {(view === "students" ? studentPlans : businessPlans).map((plan, i) => (
                            <motion.div 
                                key={plan.title}
                                className={`pricing-card ${plan.highlight ? 'highlight' : ''}`}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className="card-header">
                                    <span className="h-label-mono">{plan.label}</span>
                                    <h3 className="plan-title Montserrat-900">{plan.title}</h3>
                                </div>
                                
                                <div className="price-block">
                                    <div className="plan-price">
                                        <span className="currency">ARS $</span>
                                        <span className="amount">{plan.price}</span>
                                    </div>
                                    <span className="plan-period Montserrat-700">// {plan.period}</span>
                                </div>

                                <p className="plan-desc">{plan.desc}</p>
                                
                                <ul className="plan-features">
                                    {plan.features.map((f, idx) => (
                                        <li key={idx} className="Montserrat-500">
                                            <span className="bullet">_</span> {f}
                                        </li>
                                    ))}
                                </ul>

                                <button className="plan-cta Montserrat-900" onClick={() => handlePurchase(plan.title)}>
                                    {plan.title === "CERTIFICACIÓN INDIVIDUAL" ? "ADQUIRIR_EXAMEN" : "COMPRAR"}
                                </button>
                                
                                {plan.highlight && <div className="highlight-glow" />}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>
        </main>
    );
};

export default Pricing;