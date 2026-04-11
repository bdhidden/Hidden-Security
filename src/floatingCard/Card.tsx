import React, { useState, useEffect } from 'react';
import { motion, MotionValue } from 'framer-motion';

interface CardProps {
  data: {
    frente: string;
    reverso: {
      titulo: string;
      subtitulo: string;
      items: string[];
    };
  };
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

const Card: React.FC<CardProps> = ({ data, index, total }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detector de ancho de pantalla para el cambio de lógica a los 768px
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const gap = 400; 
  const initialX = (index - (total - 1) / 2) * gap;

  // Estilos dinámicos: En mobile usamos 'relative' para que se pongan en columna
  const containerStyle: React.CSSProperties = isMobile 
    ? {
        position: 'relative',
        top: '800px',
        width: '260px', 
        height: '380px', 
        margin: '0 auto',
        perspective: '1500px',
        zIndex: 1,
      }
    : {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '300px',
        height: '420px',
        marginLeft: `${initialX - 150}px`,
        marginTop: '-210px',
        zIndex: isHovered ? 100 : total - index,
        perspective: '1500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };

  return (
    <div 
      className="hc-card-hitbox"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={() => isMobile && setIsHovered(!isHovered)} // En móvil el hover es con click
      style={containerStyle}
    >
      <motion.div 
        className="hc-carta-wrap"
        style={{ 
          width: '100%',
          height: '100%',
          transformStyle: "preserve-3d",
          cursor: 'pointer',
          originX: 0.5,
        }}
        animate={{ 
          rotateY: isHovered ? -180 : 0,
          y: isHovered ? 20 : [40, 50, 40] 
        }}
        onUpdate={(latest: any) => {
          if (latest.rotateY <= -90 && !isFlipped) setIsFlipped(true);
          if (latest.rotateY > -90 && isFlipped) setIsFlipped(false);
        }}
        transition={{ 
          rotateY: { type: "spring", stiffness: 60, damping: 12 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="hc-carta-inner-content" style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
          
          {/* CARA FRONTAL */}
          <div className="hc-face hc-carta-frente" style={{ 
            backfaceVisibility: 'hidden', 
            position: 'absolute', 
            inset: 0,
            WebkitBackfaceVisibility: 'hidden' 
          }}>
            <img src={data.frente} alt="Logo" className="hc-logo-card" />
          </div>
          
          {/* CARA TRASERA */}
          <div className="hc-face hc-carta-reverso" style={{ 
            transform: "rotateY(180deg)", 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0 
          }}>
            <div className="hc-reverso-layout">
              <motion.span className="hc-tag" animate={{ opacity: isFlipped ? 1 : 0 }}>
                MÓDULO 0{index + 1}
              </motion.span>
              
              <motion.h3 
                className="hc-titulo-reverso"
                animate={{ y: isFlipped ? 0 : 20, opacity: isFlipped ? 1 : 0 }}
              >
                {data.reverso.titulo}
              </motion.h3>

              <motion.p 
                className="hc-subtitulo-reverso"
                animate={{ opacity: isFlipped ? 0.7 : 0 }}
              >
                {data.reverso.subtitulo}
              </motion.p>

              <ul className="hc-lista-cursos">
                {data.reverso.items.map((item, i) => (
                  <motion.li 
                    key={i}
                    animate={isFlipped ? { x: 0, opacity: 1 } : { x: -10, opacity: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    <span className="hc-bullet"></span> {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Card;