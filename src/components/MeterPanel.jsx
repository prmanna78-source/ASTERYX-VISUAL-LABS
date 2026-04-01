import { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function AnalogMeter({ label, value, unit, min, max, color }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h * 0.72;
    const r = Math.min(w, h) * 0.4;

    ctx.clearRect(0, 0, w, h);

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 0.25, false);
    ctx.strokeStyle = 'rgba(0,200,255,0.1)';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Value arc
    const fraction = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const startAngle = Math.PI * 0.75;
    const endAngle = startAngle + fraction * Math.PI * 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Tick marks
    for (let i = 0; i <= 10; i++) {
      const angle = startAngle + (i / 10) * Math.PI * 1.5;
      const isMain = i % 5 === 0;
      const len = isMain ? 12 : 7;
      const rOuter = r + 2;
      const rInner = r - len;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
      ctx.lineTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
      ctx.strokeStyle = isMain ? 'rgba(0,200,255,0.6)' : 'rgba(0,200,255,0.25)';
      ctx.lineWidth = isMain ? 2 : 1;
      ctx.stroke();
    }

    // Needle
    const needleAngle = startAngle + fraction * Math.PI * 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(needleAngle) * (r - 8), cy + Math.sin(needleAngle) * (r - 8));
    ctx.strokeStyle = '#ff3366';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ff3366';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Center pivot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff3366';
    ctx.fill();

    // Label
    ctx.fillStyle = 'rgba(143,170,200,0.8)';
    ctx.font = '10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, h - 4);
  }, [value, min, max, color, label]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={130} height={90} style={{ display: 'block', margin: '0 auto' }} />
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700,
        color: color, marginTop: -6,
      }}>
        {typeof value === 'number' ? value.toFixed(3) : '0.000'} <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{unit}</span>
      </div>
    </div>
  );
}

export default function MeterPanel({ readings, running, graphData, experiment }) {
  const meters = [
    readings.voltage !== undefined && { key: 'voltage', label: 'Voltmeter', unit: 'V', min: 0, max: 15, color: '#7b2ff7', value: readings.voltage },
    readings.current !== undefined && { key: 'current', label: 'Ammeter', unit: 'A', min: 0, max: 2, color: '#00c8ff', value: readings.current },
    readings.galvanometer !== undefined && { key: 'galvanometer', label: 'Galvanometer', unit: 'µA', min: -100, max: 100, color: '#ffe600', value: readings.galvanometer },
    readings.resistance !== undefined && { key: 'resistance', label: 'Resistance', unit: 'Ω', min: 0, max: 1000, color: '#ff7b00', value: readings.resistance },
    readings.capacitorV !== undefined && { key: 'capacitorV', label: 'Cap. Voltage', unit: 'V', min: 0, max: 15, color: '#ff3366', value: readings.capacitorV },
  ].filter(Boolean);

  const hasGraph = graphData.length > 1 && graphData[0];
  const graphKeys = hasGraph ? Object.keys(graphData[0]) : [];
  const xKey = graphKeys[0], yKey = graphKeys[1];

  const chartData = hasGraph ? {
    labels: graphData.map(p => Number(p[xKey]).toFixed(2)),
    datasets: [{
      label: yKey,
      data: graphData.map(p => p[yKey]),
      borderColor: '#00c8ff',
      backgroundColor: 'rgba(0,200,255,0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#00c8ff',
      borderWidth: 2,
    }],
  } : null;

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(8,15,30,0.95)',
        borderColor: 'rgba(0,200,255,0.3)',
        borderWidth: 1,
        titleColor: '#00c8ff',
        bodyColor: '#8faac8',
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,200,255,0.06)' },
        ticks: { color: '#4a6280', font: { size: 9 } },
        title: { display: true, text: xKey, color: '#4a6280', font: { size: 9 } },
      },
      y: {
        grid: { color: 'rgba(0,200,255,0.06)' },
        ticks: { color: '#4a6280', font: { size: 9 } },
        title: { display: true, text: yKey, color: '#4a6280', font: { size: 9 } },
      },
    },
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', background: 'rgba(5,13,26,0.6)' }}>
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid rgba(0,200,255,0.08)',
        fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '1px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: running ? '#00ff88' : '#4a6280', display: 'inline-block', boxShadow: running ? '0 0 8px #00ff88' : 'none' }} />
        Live Readings
      </div>

      {meters.length === 0 ? (
        <div style={{ padding: 20, color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
          {running ? 'No readings available' : 'Run experiment to see readings'}
        </div>
      ) : (
        <div style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {meters.map(m => <AnalogMeter key={m.key} {...m} />)}
        </div>
      )}

      {/* Graph */}
      {hasGraph && (
        <div style={{ padding: '0 10px 14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {xKey} vs {yKey}
          </div>
          <div style={{ height: 140, background: 'rgba(8,15,30,0.5)', borderRadius: 8, padding: 6, border: '1px solid rgba(0,200,255,0.06)' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
