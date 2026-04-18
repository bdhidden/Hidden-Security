import * as THREE from 'three'
import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, Lightformer } from '@react-three/drei'
import { Physics, RigidBody, RigidBodyApi, CuboidCollider, BallCollider } from '@react-three/rapier'
import { motion, AnimatePresence } from "framer-motion"
import { easing } from 'maath'

// Contextos
import { UseWidth } from '../contexts/WidthContext'
import { UseTheme } from '../contexts/ThemeContext'
import LiveTypingText from "../ui/LiveTypingText"

import "./lusionPricing.css"

const PALETTES = {
  dark: ['#ccff00', '#ffffff', '#111111'],
  light: ['#ff5500', '#000000', '#ffffff']
}

const TOTAL_ITEMS = 40; 

// --- COMPONENTE PRINCIPAL ---
export default function LusionPricing() {
  const { width } = UseWidth()
  const { theme } = UseTheme()
  const isMobile = width <= 768
  const [view, setView] = useState<"students" | "business">("students")
  
  // Lógica de captura de velocidad de scroll
  const scrollRef = useRef(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    
    const handleScroll = () => {
      const currentScroll = window.scrollY
      const velocity = currentScroll - scrollRef.current
      setScrollVelocity(velocity)
      scrollRef.current = currentScroll
      
      // Limpiar la velocidad después de un breve momento de inactividad
      const timeout = setTimeout(() => setScrollVelocity(0), 100)
      return () => clearTimeout(timeout)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const bgColor = theme === "dark" ? "#000000" : "#ffffff";

  return (
    <div className={`lusion-pricing-wrapper ${theme}`} style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      
      {/* CAPA 3D DE FONDO (FIJA) */}
      <div style={{ 
        position: 'fixed', 
        top: 0, left: 0, 
        width: '100%', height: '100vh', 
        zIndex: -1, 
        backgroundColor: bgColor,
        pointerEvents: 'none' 
      }}>
        <Canvas shadows camera={{ position: [0, 0, 25], fov: 35 }}>
          <color attach="background" args={[bgColor]} />
          <LusionScene theme={theme} isMobile={isMobile} scrollVelocity={scrollVelocity} />
        </Canvas>
      </div>

      {/* CAPA DE CONTENIDO */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', background: 'transparent' }}>
        <PricingContent view={view} setView={setView} theme={theme} />
      </div>
    </div>
  )
}

// --- LÓGICA 3D (ESCENA) ---
function LusionScene({ theme, isMobile, scrollVelocity }: any) {
  const currentPalette = theme === 'dark' ? PALETTES.dark : PALETTES.light
  const { viewport } = useThree()

  const itemData = useMemo(() => 
    Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
      id: i,
      position: [
        THREE.MathUtils.randFloatSpread(viewport.width * 0.8), 
        THREE.MathUtils.randFloat(viewport.height / 2, viewport.height), 
        THREE.MathUtils.randFloatSpread(5)
      ] as [number, number, number],
      colorIndex: i % currentPalette.length,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number]
    })), [viewport.width, viewport.height, currentPalette])

  return (
    <>
      <ambientLight intensity={theme === "dark" ? 0.4 : 1.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Physics gravity={[0, -5, 0]} colliders={false}>
        <MouseStriker isMobile={isMobile} />
        <GlassCage />

        {itemData.map((data) => (
          <CandyConnector 
            key={data.id} 
            {...data} 
            color={currentPalette[data.colorIndex]} 
            scrollVelocity={scrollVelocity}
          />
        ))}
      </Physics>

      <Environment resolution={256} preset="apartment">
        <Lightformer form="rect" intensity={2} position={[2, 5, -10]} scale={[10, 1, 1]} />
      </Environment>
    </>
  )
}

// --- ELEMENTO FÍSICO (CONECTOR) ---
function CandyConnector({ position, color, rotation, scrollVelocity }: any) {
  const api = useRef<RigidBodyApi>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)

  useFrame((_state, delta) => {
    if (!api.current || !meshRef.current) return
    
    // Aplicar impulso basado en el scroll
    if (Math.abs(scrollVelocity) > 1) {
      api.current.applyImpulse({ 
        x: 0, 
        y: -scrollVelocity * 0.12, // Fuerza proporcional al scroll
        z: 0 
      }, true)
      
      api.current.applyTorqueImpulse({
        x: (Math.random() - 0.5) * 0.05,
        y: (Math.random() - 0.5) * 0.05,
        z: (Math.random() - 0.5) * 0.05
      }, true)
    }

    const targetColor = new THREE.Color(hovered ? '#ffffff' : color)
    // @ts-ignore
    easing.dampC(meshRef.current.material.color, targetColor, 0.2, delta)
  })

  return (
    <RigidBody 
      ref={api} position={position} rotation={rotation} colliders={false} 
      linearDamping={0.7} angularDamping={0.5} restitution={0.8}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      <Model ref={meshRef} />
    </RigidBody>
  )
}

const Model = React.forwardRef<THREE.Mesh>((_props, ref) => {
  const { nodes } = useGLTF('/c-transformed.glb') as any
  return (
    <mesh ref={ref} scale={10} geometry={nodes.connector.geometry} castShadow receiveShadow>
      <meshStandardMaterial roughness={0.1} metalness={0.2} />
    </mesh>
  )
})

// --- LÍMITES FÍSICOS ---
function GlassCage() {
  const { viewport } = useThree()
  const thickness = 2
  return (
    <RigidBody type="fixed" colliders="cuboid" restitution={1} friction={0.1}>
      <CuboidCollider args={[viewport.width, thickness, 10]} position={[0, -viewport.height / 2 - thickness, 0]} />
      <CuboidCollider args={[viewport.width, thickness, 10]} position={[0, viewport.height / 2 + 15, 0]} />
      <CuboidCollider args={[thickness, viewport.height * 2, 10]} position={[-viewport.width / 2 - thickness, 0, 0]} />
      <CuboidCollider args={[thickness, viewport.height * 2, 10]} position={[viewport.width / 2 + thickness, 0, 0]} />
      <CuboidCollider args={[viewport.width, viewport.height, thickness]} position={[0, 0, -5]} />
      <CuboidCollider args={[viewport.width, viewport.height, thickness]} position={[0, 0, 5]} />
    </RigidBody>
  )
}

function MouseStriker({ isMobile }: any) {
  const ref = useRef<RigidBodyApi>(null!)
  const vec = new THREE.Vector3()
  useFrame(({ mouse, viewport }) => {
    vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0)
    if (ref.current) ref.current.setNextKinematicTranslation(vec)
  })
  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false}>
      <BallCollider args={[isMobile ? 1.5 : 2.5]} />
    </RigidBody>
  )
}

// --- UI CONTENT ---
function PricingContent({ view, setView, theme }: any) {
    const studentPlans = [
        { title: "STARTER", price: "80.000", period: "3 MESES DISPONIBLES", features: ["Acceso completo al curso", "Material descargable", "Certificado de cursada"], label: "01 - TRAINING" },
        { title: "PRO", price: "250.000", period: "6 MESES DISPONIBLES", features: ["1 Voucher de examen incluido", "Acceso a laboratorios", "Soporte prioritario"], label: "02 - BEST_SELLER", highlight: true },
        { title: "ELITE", price: "350.000", period: "12 MESES DISPONIBLES", features: ["Beneficio de Re-intento", "Mentorship 1-to-1", "Acceso a Red de Empleo"], label: "03 - FULL_STACK" },
        { title: "VOUCHER", price: "180.000", period: "UNICO USO", features: ["Derecho a examen final", "Certificación oficial", "Validez internacional"], label: "04 - CERTIFICATION" }
    ];

    const businessPlans = [
        { title: "B2B_SEIS", price: "400.000", period: "6 MESES", features: ["Acceso a base de perfiles", "Filtros por habilidades", "3 Búsquedas activas", "Candidatos en dominio activo"], label: "01 // BUSINESS_CORE" },
        { title: "B2B_DOCE", price: "700.000", period: "12 MESES", features: ["Publicaciones ilimitadas", "Estabilidad comercial extendida", "Continuidad en el ecosistema", "Soporte dedicado 24/7"], label: "02 // ENTERPRISE_PRO", highlight: true }
    ];

    return (
        <main className={`pricing-root ${theme}`}>
            <section className="pricing-container">
                <header className="pricing-header">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="h-label-mono">// INFRAESTRUCTURA DE COSTOS</span>
                        <h1 className="h-massive-title Montserrat-900">
                            PLANES DE <span className="h-outline">SUSCRIPCIÓN</span>
                        </h1>
                        <div className="pricing-intro-p">
                            <LiveTypingText text="Despliega tu potencial con nuestros nodos de capacitación. Estructuras escalables para individuos y corporaciones de alto rendimiento." />
                        </div>
                    </motion.div>
                    
                    <div className="pricing-selector-container">
                        <div className="pricing-toggle-wrapper">
                            <button className={`toggle-btn Montserrat-800 ${view === "students" ? "active" : ""}`} onClick={() => setView("students")}>ESTUDIANTES</button>
                            <button className={`toggle-btn Montserrat-800 ${view === "business" ? "active" : ""}`} onClick={() => setView("business")}>CORPORATIVO</button>
                            <motion.div className="toggle-slider" animate={{ x: view === "students" ? "0%" : "100%" }} />
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
                                        <span className="currency">ARS</span>
                                        <span className="amount">{plan.price}</span>
                                    </div>
                                    <span className="plan-period Montserrat-700">// {plan.period}</span>
                                </div>
                                <ul className="plan-features">
                                    {plan.features.map((f, idx) => (
                                        <li key={idx} className="Montserrat-500"><span className="bullet">_</span> {f}</li>
                                    ))}
                                </ul>
                                <button className="plan-cta Montserrat-900">SOLICITAR_ACCESO</button>
                                {plan.highlight && <div className="highlight-glow" />}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>
        </main>
    )
}

useGLTF.preload('/c-transformed.glb')