import { motion } from 'framer-motion';

export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--bg-void)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Animated Rings Background */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            marginTop: '-20px', // counteract margin bottom of logo
            width: 140, height: 140,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '2px dashed rgba(0, 200, 255, 0.3)',
            borderTopColor: 'var(--electric-blue)',
            zIndex: 1,
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 170, height: 170,
            marginTop: '-20px',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1px solid rgba(123, 47, 247, 0.2)',
            borderBottomColor: 'var(--electric-purple)',
            zIndex: 1,
          }}
        />

        {/* Pulse effect behind logo */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            marginTop: '-20px',
            width: 80, height: 80,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(0,200,255,0.4) 0%, transparent 70%)',
            zIndex: 1,
            borderRadius: '50%',
          }}
        />

        {/* Logo */}
        <motion.img
          src="/astryx-logo.png"
          alt="Astryx Logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            width: 80, height: 80, objectFit: 'contain',
            position: 'relative', zIndex: 2,
            filter: 'drop-shadow(0 0 20px rgba(0, 200, 255, 0.5))',
            marginBottom: 40,
          }}
        />

        {/* Powered By Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            position: 'relative', zIndex: 2,
          }}
        >
          <span style={{ 
            fontSize: '0.75rem', color: 'var(--text-muted)', 
            letterSpacing: '3px', textTransform: 'uppercase',
            fontWeight: 600
          }}>
            Powered By
          </span>
          <span style={{ 
            fontSize: '1.4rem', fontWeight: 900, letterSpacing: '2px',
            background: 'linear-gradient(135deg, #00c8ff, #7b2ff7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(0, 200, 255, 0.2)'
          }}>
            ASTRYX
          </span>
        </motion.div>

        {/* Small loader bar below */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 140, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
          style={{
            height: 2, background: 'linear-gradient(90deg, transparent, var(--electric-cyan), transparent)',
            marginTop: 24, position: 'relative', zIndex: 2,
            boxShadow: '0 0 10px var(--electric-cyan)',
            borderRadius: 2
          }}
        />
      </div>
    </motion.div>
  );
}
