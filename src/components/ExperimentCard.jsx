import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Cpu, ChevronRight, Beaker } from 'lucide-react';
import { motion } from 'framer-motion';

const difficultyColor = {
  'Beginner': '#00ff88',
  'Intermediate': '#ffe600',
  'Advanced': '#ff7b00',
};

const categoryColor = {
  'Basic': '#00c8ff',
  'Intermediate': '#7b2ff7',
  'Advanced': '#ff3366',
  'Digital': '#00ffea',
};

export default function ExperimentCard({ experiment, index }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/lab/${experiment.id}`)}
      style={{
        position: 'relative',
        background: hovered
          ? `linear-gradient(145deg, rgba(13,24,41,0.95), rgba(13,24,41,0.85))`
          : 'rgba(13,24,41,0.6)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? experiment.color + '60' : 'rgba(0,200,255,0.08)'}`,
        borderRadius: 20,
        padding: '28px',
        cursor: 'pointer',
        transition: 'all 0.35s ease',
        transform: hovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 20px 60px ${experiment.color}25, 0 0 0 1px ${experiment.color}30`
          : '0 4px 20px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 120, height: 120, borderRadius: '50%',
        background: experiment.color,
        opacity: hovered ? 0.12 : 0.05,
        filter: 'blur(40px)',
        transition: 'opacity 0.35s ease',
        pointerEvents: 'none',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: `${experiment.color}18`,
          border: `1px solid ${experiment.color}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem',
          boxShadow: hovered ? `0 0 20px ${experiment.color}40` : 'none',
          transition: 'box-shadow 0.35s ease',
        }}>
          {experiment.icon}
        </div>

        {/* Category badge */}
        <div style={{
          padding: '4px 12px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600,
          background: `${categoryColor[experiment.category]}18`,
          color: categoryColor[experiment.category],
          border: `1px solid ${categoryColor[experiment.category]}35`,
        }}>
          {experiment.category}
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '1.1rem', fontWeight: 700,
        color: hovered ? experiment.color : 'var(--text-primary)',
        marginBottom: 6, transition: 'color 0.35s ease',
      }}>
        {experiment.title}
      </h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14, fontWeight: 500 }}>
        {experiment.subtitle}
      </p>

      {/* Description */}
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
        {experiment.description}
      </p>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <Clock size={12} />
          {experiment.duration}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem' }}>
          <Cpu size={12} color={difficultyColor[experiment.difficulty]} />
          <span style={{ color: difficultyColor[experiment.difficulty], fontWeight: 600 }}>
            {experiment.difficulty}
          </span>
        </div>
      </div>

      {/* Apparatus mini-chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {experiment.apparatus.slice(0, 4).map(a => (
          <span key={a} style={{
            padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem',
            background: 'rgba(0,200,255,0.06)', color: 'var(--text-muted)',
            border: '1px solid rgba(0,200,255,0.1)',
          }}>
            {a}
          </span>
        ))}
        {experiment.apparatus.length > 4 && (
          <span style={{ padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            +{experiment.apparatus.length - 4} more
          </span>
        )}
      </div>

      {/* CTA */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: '1px solid rgba(0,200,255,0.08)', paddingTop: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: experiment.color, fontWeight: 600 }}>
          <Beaker size={14} />
          Open Lab
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: `${experiment.color}18`, border: `1px solid ${experiment.color}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
        }}>
          <ChevronRight size={16} color={experiment.color} />
        </div>
      </div>
    </motion.div>
  );
}
