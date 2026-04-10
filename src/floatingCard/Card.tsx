import React, { useState, useEffect } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

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

const Card: React.FC<CardProps> = ({ data, index, total, scrollYProgress }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const step = 1 / total;
  const startTurn = step * index;
  const endTurn = step * (index + 1);

  const gap = 400; 
  const initialX = (index - (total - 1) / 2) * gap;
  const rotateY = useTransform(scrollYProgress, [startTurn, endTurn], [0, -180]);

  // Detectar cuando la rotación cruza los 90 grados para activar la animación del texto
  useEffect(() => {
    const unsubscribe = rotateY.onChange((latest: number) => {
      if (latest <= -90 && !isFlipped) setIsFlipped(true);
      if (latest > -90 && isFlipped) setIsFlipped(false);
    });
    return unsubscribe;
  }, [rotateY, isFlipped]);

  return (
    <motion.div 
      className="hc-carta-wrap"
      style={{ x: initialX, rotateY, zIndex: total - index }}
      animate={{ y: [40, 62, 40] }}
      transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
    >
      <div className="hc-carta-inner-content">
        <div className="hc-face hc-carta-frente">
          <img src={data.frente} alt="Logo" className="hc-logo-card" />
        </div>
        
        <div className="hc-face hc-carta-reverso">
          <div className="hc-reverso-layout">
            <motion.span 
              className="hc-tag"
              animate={{ opacity: isFlipped ? 1 : 0 }}
            >
              MÓDULO 0{index + 1}
            </motion.span>
            
            <motion.h3 
              className="hc-titulo-reverso"
              animate={{ y: isFlipped ? 0 : 20, opacity: isFlipped ? 1 : 0 }}
              transition={{ delay: 0.1 }}
            >
              {data.reverso.titulo}
            </motion.h3>

            <motion.p 
              className="hc-subtitulo-reverso"
              animate={{ opacity: isFlipped ? 0.7 : 0 }}
              transition={{ delay: 0.2 }}
            >
              {data.reverso.subtitulo}
            </motion.p>

            <ul className="hc-lista-cursos">
              {data.reverso.items.map((item: string, i: number) => (
                <motion.li 
                  key={i}
                  initial={{ x: -10, opacity: 0 }}
                  animate={isFlipped ? { x: 0, opacity: 1 } : { x: -10, opacity: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className="hc-bullet"></span> {item}
                </motion.li>
              ))}
            </ul>
          </div>
          {/* Decoración de fondo para que no se vea vacía */}
          <div className="hc-card-watermark">HIDDEN</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;