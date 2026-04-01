import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line, Grid } from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────────
   APPARATUS CONFIGURATION
───────────────────────────────────────── */
const CFG = {
  battery:           { w:1.8,  h:1.2,  d:1.2,  render:'battery',  color:'#dcdcdc', em:'#000000', label:'DC SUPPLY', lc:'#333333', m:0.3, r:0.8, terminals:[{key:'+',ox:-0.4,oz:0.4,color:'#ff3333'},{key:'-',ox:0.4,oz:0.4,color:'#3333ff'}] },
  ammeter:           { w:1.2,  h:1.0,  d:1.0,  render:'meter',    color:'#1a1a1a', em:'#ffffff', label:'A',       lc:'#e0e0e0', m:0.6, r:0.4, terminals:[{key:'A',ox:-0.4,oz:0.35,color:'#ff3333'},{key:'B',ox:0.4,oz:0.35,color:'#3333ff'}] },
  voltmeter:         { w:1.2,  h:1.0,  d:1.0,  render:'meter',    color:'#1a1a1a', em:'#ffffff', label:'V',       lc:'#e0e0e0', m:0.6, r:0.4, terminals:[{key:'A',ox:-0.4,oz:0.35,color:'#ff3333'},{key:'B',ox:0.4,oz:0.35,color:'#3333ff'}] },
  galvanometer:      { w:1.2,  h:1.0,  d:1.0,  render:'meter',    color:'#1a1a1a', em:'#ffffff', label:'G',       lc:'#e0e0e0', m:0.6, r:0.4, terminals:[{key:'A',ox:-0.4,oz:0.35,color:'#ff3333'},{key:'B',ox:0.4,oz:0.35,color:'#3333ff'}] },
  resistor:          { w:1.4,  h:0.8,  d:0.8,  render:'resistor', color:'#b37746', em:'#000000', label:'RES BOX', lc:'#ffffff', m:0.1, r:0.9, terminals:[{key:'A',ox:-0.5,oz:0,color:'#f7d057'},{key:'B',ox:0.5,oz:0,color:'#f7d057'}] },
  rheostat:          { w:2.6,  h:1.0,  d:0.8,  render:'rheostat', color:'#111111', em:'#000000', label:'RHEOSTAT',lc:'#ffffff', m:0.2, r:0.8, terminals:[{key:'A',ox:-1.1,oz:0.25,color:'#ff3333'},{key:'B',ox:1.1,oz:0.25,color:'#f7d057'},{key:'C',ox:0,oz:-0.25,color:'#3333ff'}] },
  switch:            { w:1.2,  h:0.3,  d:0.8,  render:'switch',   color:'#b37746', em:'#000000', label:'KEY',       lc:'#111111', m:0.1, r:0.9, terminals:[{key:'A',ox:-0.4,oz:0,color:'#f7d057'},{key:'B',ox:0.4,oz:0,color:'#f7d057'}] },
  capacitor:         { w:0.6,  h:1.0,  d:0.6,  render:'capacitor',color:'#4287f5', em:'#ffffff', label:'C',       lc:'#ffffff', m:0.5, r:0.5, terminals:[{key:'+',ox:0,oz:-0.4,color:'#ff3333'},{key:'-',ox:0,oz:0.4,color:'#3333ff'}] },
  diode:             { w:0.8,  h:0.2,  d:0.2,  render:'diode',    color:'#111111', em:'#ffffff', label:'PN DIODE',  lc:'#ffffff', m:0.3, r:0.7, terminals:[{key:'A',ox:-0.5,oz:0,color:'#f7d057'},{key:'K',ox:0.5,oz:0,color:'#f7d057'}] },
  zener:             { w:0.8,  h:0.2,  d:0.2,  render:'diode',    color:'#4287f5', em:'#ffffff', label:'ZENER',     lc:'#ffffff', m:0.3, r:0.7, terminals:[{key:'A',ox:-0.5,oz:0,color:'#f7d057'},{key:'K',ox:0.5,oz:0,color:'#f7d057'}] },
  led:               { w:0.5,  h:0.6,  d:0.5,  render:'led',      color:'#ee0000', em:'#ff0000', label:'LED',       lc:'#ffffff', m:0.5, r:0.2, terminals:[{key:'+',ox:0,oz:-0.35,color:'#ff3333'},{key:'-',ox:0,oz:0.35,color:'#3333ff'}] },
  ic_gate:           { w:1.2,  h:0.2,  d:0.8,  render:'ic',       color:'#222222', em:'#00ffea', label:'IC',        lc:'#ffffff', m:0.3, r:0.5, terminals:[{key:'A',ox:-0.6,oz:-0.2,color:'#ff3333'},{key:'B',ox:-0.6,oz:0.2,color:'#f7d057'},{key:'Y',ox:0.6,oz:0,color:'#3333ff'}] },
  wire:              { w:0.5,  h:0.1,  d:0.5,  render:'wire',     color:'#555555', em:'#8faac8', label:'NODE',      lc:'#e0e0e0', m:0.1, r:0.9, terminals:[{key:'A',ox:-0.25,oz:0,color:'#cccccc'},{key:'B',ox:0.25,oz:0,color:'#cccccc'}] },
  cell:              { w:0.8,  h:1.2,  d:0.8,  render:'cell',     color:'#88ccff', em:'#000000', label:'CELL',      lc:'#111111', m:0.9, r:0.1, terminals:[{key:'+',ox:0,oz:-0.5,color:'#ff3333'},{key:'-',ox:0,oz:0.5,color:'#3333ff'}] },
  ac_supply:         { w:2.0,  h:1.2,  d:1.5,  render:'ac',       color:'#dcdcdc', em:'#00c8ff', label:'AC SRC.',   lc:'#333333', m:0.3, r:0.8, terminals:[{key:'~',ox:-0.4,oz:0.5,color:'#ff3333'},{key:'~',ox:0.4,oz:0.5,color:'#333333'}] },
  inductor:          { w:1.2,  h:0.5,  d:0.5,  render:'inductor', color:'#ff7b00', em:'#000000', label:'COIL',      lc:'#ffffff', m:0.5, r:0.5, terminals:[{key:'A',ox:-0.5,oz:0,color:'#f7d057'},{key:'B',ox:0.5,oz:0,color:'#f7d057'}] },
  multimeter:        { w:1.0,  h:1.2,  d:0.4,  render:'multimeter',color:'#222222', em:'#00ffea', label:'DMM',      lc:'#e0e0e0', m:0.1, r:0.8, terminals:[{key:'V/Ω',ox:-0.3,oz:0.2,color:'#ff3333'},{key:'COM',ox:0,oz:0.2,color:'#333333'},{key:'A',ox:0.3,oz:0.2,color:'#ff3333'}] },
  potentiometer_wire:{ w:4.0,  h:0.2,  d:0.6,  render:'potwire',  color:'#b37746', em:'#000000', label:'POT. BOARD',lc:'#111111', m:0.1, r:0.9, terminals:[{key:'A',ox:-1.9,oz:0,color:'#f7d057'},{key:'B',ox:1.9,oz:0,color:'#f7d057'}] },
  jockey:            { w:0.15, h:0.8,  d:0.15, render:'jockey',   color:'#111111', em:'#000000', label:'JOCKEY',    lc:'#ffffff', m:0.8, r:0.2, terminals:[{key:'T',ox:0,oz:0,color:'#f7d057'}] },
};

function getCFG(type) { return CFG[type] || CFG.resistor; }

/* ─────────────────────────────────────────
   TERMINAL SPHERE
───────────────────────────────────────── */
function Terminal({ position, color, onClick }) {
  const ref = useRef();
  const [hov, setHov] = useState(false);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.setScalar(hov ? 1.5 : 1 + Math.sin(clock.elapsedTime * 3) * 0.06);
  });
  return (
    <mesh ref={ref} position={position} onPointerDown={(e) => { e.stopPropagation(); onClick(); }} onPointerOver={(e) => { e.stopPropagation(); setHov(true); document.body.style.cursor='crosshair'; }} onPointerOut={() => { setHov(false); document.body.style.cursor='default'; }}>
      <sphereGeometry args={[0.1, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hov ? 2 : 0.8} metalness={0.5} roughness={0.1} />
    </mesh>
  );
}

/* ─────────────────────────────────────────
   3D APPARATUS BODY (per render type)
───────────────────────────────────────── */
function ApparatusBody({ cfg, type, running }) {
  const em = running ? cfg.em : '#000000';
  const ei = running ? 0.4 : 0;
  const mat = <meshStandardMaterial color={cfg.color} emissive={em} emissiveIntensity={ei} metalness={cfg.m} roughness={cfg.r} />;

  switch (cfg.render) {
    case 'battery':
      return (
        <group>
          {/* Main metal casing */}
          <mesh castShadow><boxGeometry args={[cfg.w, cfg.h, cfg.d]} />{mat}</mesh>
          {/* Front panel detailing (lighter grey) */}
          <mesh position={[0, 0, cfg.d/2+0.01]}><boxGeometry args={[cfg.w-0.2, cfg.h-0.2, 0.02]} /><meshStandardMaterial color="#cccccc" metalness={0.2} /></mesh>
          {/* Knob */}
          <mesh position={[-0.4, 0, cfg.d/2+0.05]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.2, 0.25, 0.1, 16]} /><meshStandardMaterial color="#222222" /></mesh>
          {/* LED Indicator */}
          <mesh position={[0, 0.2, cfg.d/2+0.02]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color={running?"#00ff00":"#440000"} emissive={running?"#00ff00":"#000000"} emissiveIntensity={running?2:0} /></mesh>
          {/* Terminals (top) slightly protruding */}
        </group>
      );

    case 'meter':
      return (
        <group>
          {/* Slanted analog meter housing */}
          <mesh castShadow position={[0, 0, 0.1]}>
            <boxGeometry args={[cfg.w, cfg.h*0.8, cfg.d*0.8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
          </mesh>
          {/* Slanted face plate */}
          <mesh position={[0, cfg.h/2-0.08, -0.2]} rotation={[-Math.PI*0.15, 0, 0]}>
            <boxGeometry args={[cfg.w*0.85, 0.7, 0.1]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.1} />
          </mesh>
          {/* Needle indicator */}
          <mesh position={[0, cfg.h/2-0.08, -0.15]} rotation={[0, 0, running ? -0.4 : 0.4]}>
            <boxGeometry args={[0.02, 0.5, 0.02]} />
            <meshStandardMaterial color="#ff1111" />
          </mesh>
          {/* Terminal base platform */}
          <mesh position={[0, -cfg.h*0.3, 0.3]}><boxGeometry args={[cfg.w, 0.2, 0.4]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
        </group>
      );

    case 'resistor':
      return (
        <group>
          {/* Real Resistance Box (wooden) */}
          <mesh castShadow position={[0, -0.1, 0]}><boxGeometry args={[cfg.w, cfg.h*0.6, cfg.d]} />{mat}</mesh>
          {/* Brass top plate */}
          <mesh position={[0, cfg.h*0.2, 0]}><boxGeometry args={[cfg.w-0.1, 0.05, cfg.d-0.1]} /><meshStandardMaterial color="#d4b454" metalness={0.8} roughness={0.2} /></mesh>
          {/* Plug knobs */}
          {[-0.3,0,0.3].map((x, i) => (
             <mesh key={i} position={[x, cfg.h*0.3, 0]}><cylinderGeometry args={[0.08, 0.06, 0.2, 16]} /><meshStandardMaterial color="#222" /></mesh>
          ))}
        </group>
      );

    case 'rheostat':
      return (
        <group>
          {/* End brackets */}
          <mesh castShadow position={[-cfg.w/2+0.1, 0, 0]}><boxGeometry args={[0.2, cfg.h, cfg.d]} /><meshStandardMaterial color="#2a2a2a" /></mesh>
          <mesh castShadow position={[cfg.w/2-0.1, 0, 0]}><boxGeometry args={[0.2, cfg.h, cfg.d]} /><meshStandardMaterial color="#2a2a2a" /></mesh>
          {/* Main ceramic tube */}
          <mesh position={[0, -0.1, 0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.3, 0.3, cfg.w-0.4, 32]} /><meshStandardMaterial color="#222222" /></mesh>
          {/* Coil rings texture suggestion (multiple rings) */}
          {Array.from({length:30}, (_,i)=>(
             <mesh key={i} position={[-cfg.w/2 + 0.3 + i*((cfg.w-0.6)/30), -0.1, 0]} rotation={[0,0,Math.PI/2]}><circleGeometry args={[0.31, 16]} /><meshStandardMaterial color="#111111" /></mesh>
          ))}
          {/* Top slider rod */}
          <mesh position={[0, cfg.h/2-0.1, 0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.04, 0.04, cfg.w, 16]} /><meshStandardMaterial color="#cccccc" metalness={0.9} /></mesh>
          {/* Sliding contact block */}
          <mesh position={[running ? 0.4 : -0.4, cfg.h/2-0.1, 0]}><boxGeometry args={[0.3, 0.4, 0.4]} /><meshStandardMaterial color="#111" /></mesh>
        </group>
      );

    case 'switch':
      return (
        <group>
          {/* Wooden base */}
          <mesh castShadow position={[0, -0.1, 0]}><boxGeometry args={[cfg.w, 0.1, cfg.d]} />{mat}</mesh>
          {/* Two brass blocks */}
          <mesh position={[-0.25, 0.05, 0]}><boxGeometry args={[0.4, 0.2, 0.4]} /><meshStandardMaterial color="#d4b454" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0.25, 0.05, 0]}><boxGeometry args={[0.4, 0.2, 0.4]} /><meshStandardMaterial color="#d4b454" metalness={0.8} roughness={0.2} /></mesh>
          {/* Brass plug key (present when closed/running) */}
          <mesh position={[0, 0.15, 0]} scale={[1, running?1:0.01, 1]}><cylinderGeometry args={[0.08, 0.08, 0.4, 16]} /><meshStandardMaterial color="#111111" /></mesh>
        </group>
      );

    case 'capacitor':
      return (
        <group>
          <mesh castShadow><cylinderGeometry args={[0.3, 0.3, cfg.h, 24]} />{mat}</mesh>
          <mesh position={[0, cfg.h/2-0.06, 0]}><cylinderGeometry args={[0.302, 0.302, 0.12, 24]} /><meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} /></mesh>
        </group>
      );

    case 'diode':
      return (
        <group>
          <mesh castShadow position={[0,0,0]}><cylinderGeometry args={[0.1,0.1,cfg.w,16]} rotation={[0,0,Math.PI/2]}/><meshStandardMaterial color="#111" /></mesh>
          {/* Silver Cathode band */}
          <mesh position={[cfg.w*0.3, 0, 0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.102, 0.102, 0.1, 16]} /><meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} /></mesh>
        </group>
      );

    case 'led':
      return (
        <group>
          <mesh castShadow position={[0, 0.1, 0]}><sphereGeometry args={[0.25, 16, 16, 0, Math.PI*2, 0, Math.PI/2]} /><meshStandardMaterial color={cfg.em} emissive={cfg.em} emissiveIntensity={running ? 2 : 0.2} transparent opacity={0.85} metalness={0.2} roughness={0.1} /></mesh>
          <mesh position={[0,-0.15,0]}><cylinderGeometry args={[0.25,0.25,0.3,16]} /><meshStandardMaterial color={cfg.color} metalness={0.1} roughness={0.1} transparent opacity={0.6}/></mesh>
          {running && <pointLight position={[0, 0.3, 0]} color={cfg.em} intensity={2} distance={2} />}
        </group>
      );

    case 'ic':
      return (
        <group>
          <mesh castShadow><boxGeometry args={[cfg.w, cfg.h, cfg.d]} />{mat}</mesh>
          {[-0.4,-0.15,0.15,0.4].map((x,i) => (
            <group key={i}>
              <mesh position={[x, -cfg.h/2, 0.45]}><boxGeometry args={[0.1,0.2,0.1]} /><meshStandardMaterial color="#aaaaaa" metalness={1} /></mesh>
              <mesh position={[x, -cfg.h/2, -0.45]}><boxGeometry args={[0.1,0.2,0.1]} /><meshStandardMaterial color="#aaaaaa" metalness={1} /></mesh>
            </group>
          ))}
          <mesh position={[-cfg.w*0.4, cfg.h/2+0.002, 0]}><circleGeometry args={[0.07, 16]} /><meshStandardMaterial color="#111111" /></mesh>
        </group>
      );

    case 'cell':
      return (
        <group>
          {/* Glass beaker */}
          <mesh castShadow><cylinderGeometry args={[0.4,0.4,cfg.h,24]} /><meshStandardMaterial color="#88ccff" transparent opacity={0.4} metalness={0.5} roughness={0.1} /></mesh>
          {/* Zinc Electrode */}
          <mesh position={[-0.15, 0.1, 0]}><cylinderGeometry args={[0.05,0.05,1.0,16]} /><meshStandardMaterial color="#aaaaaa" /></mesh>
          {/* Copper/Carbon Electrode */}
          <mesh position={[0.15, 0.1, 0]}><cylinderGeometry args={[0.08,0.08,1.0,16]} /><meshStandardMaterial color="#442200" /></mesh>
        </group>
      );

    case 'ac':
      return (
        <group>
          {/* Main function generator casing */}
          <mesh castShadow><boxGeometry args={[cfg.w, cfg.h, cfg.d]} />{mat}</mesh>
          {/* Dark front panel */}
          <mesh position={[0, 0, cfg.d/2+0.01]}><boxGeometry args={[cfg.w-0.2, cfg.h-0.2, 0.02]} /><meshStandardMaterial color="#1a1a1a" roughness={0.4} /></mesh>
          {/* Display screen */}
          <mesh position={[-0.2, 0.2, cfg.d/2+0.02]}><boxGeometry args={[0.6, 0.3, 0.02]} /><meshStandardMaterial color="#0a2a0a" emissive={running?"#00ff2a":"#000000"} emissiveIntensity={0.5} /></mesh>
          {/* Frequency/Amp Knobs */}
          {[0.4, 0.7].map((x,i)=><mesh key={i} position={[x, 0.2, cfg.d/2+0.05]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.1,0.1,0.1,16]}/><meshStandardMaterial color="#444"/></mesh>)}
          {/* Sine wave graphic on screen */}
          {running && <mesh position={[-0.2, 0.2, cfg.d/2+0.035]}><planeGeometry args={[0.4, 0.1]} /><meshBasicMaterial color="#00ffea" wireframe /></mesh>}
        </group>
      );

    case 'inductor':
      return (
        <group>
          <mesh castShadow position={[0,-0.1,0]}><boxGeometry args={[cfg.w, 0.2, cfg.d]} /><meshStandardMaterial color="#222" /></mesh>
          <mesh position={[0,0.1,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.2,0.2,cfg.w-0.2,24]} /><meshStandardMaterial color="#b37746" metalness={0.6} /></mesh>
          {/* Coil wrapping texture */}
          {Array.from({length:20}, (_,i)=>(
             <mesh key={i} position={[-cfg.w/2 + 0.2 + i*((cfg.w-0.4)/20), 0.1, 0]} rotation={[0,0,Math.PI/2]}><circleGeometry args={[0.205, 16]} /><meshStandardMaterial color="#ff7b00" emissive="#ff7b00" emissiveIntensity={0.2} /></mesh>
          ))}
        </group>
      );

    case 'multimeter':
      return (
        <group>
          {/* Yellow protective housing */}
          <mesh castShadow><boxGeometry args={[cfg.w, cfg.h, cfg.d]} /><meshStandardMaterial color="#ffe600" roughness={0.9} /></mesh>
          {/* Dark inner body */}
          <mesh position={[0, 0, 0.02]}><boxGeometry args={[cfg.w-0.1, cfg.h-0.1, cfg.d]} /><meshStandardMaterial color="#2a2a2a" /></mesh>
          {/* LCD Screen */}
          <mesh position={[0, 0.35, cfg.d/2+0.03]}><boxGeometry args={[0.7, 0.3, 0.02]} /><meshStandardMaterial color="#aab5a8" /></mesh>
          {/* Main Dial */}
          <mesh position={[0, -0.1, cfg.d/2+0.03]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.25,0.25,0.1,24]} /><meshStandardMaterial color="#111" /></mesh>
        </group>
      );

    case 'potwire':
      return (
        <group>
          <mesh castShadow position={[0, -0.05, 0]}><boxGeometry args={[cfg.w, 0.1, cfg.d]} />{mat}</mesh>
          {/* Bright wire */}
          <mesh position={[0, 0.05, 0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.015,0.015,cfg.w-0.2,8]}/><meshStandardMaterial color="#fff" metalness={0.9} roughness={0.1} /></mesh>
          {/* Meter scale ruler graphic */}
          <mesh position={[0, 0.01, 0.15]}><boxGeometry args={[cfg.w-0.2, 0.01, 0.15]} /><meshStandardMaterial color="#e0e0e0" /></mesh>
        </group>
      );

    case 'jockey':
      return (
        <group>
          <mesh castShadow><cylinderGeometry args={[0.06,0.06,cfg.h*0.8,16]} />{mat}</mesh>
          <mesh position={[0,-cfg.h*0.4-0.1,0]}><coneGeometry args={[0.06,0.2,16]} /><meshStandardMaterial color="#d4b454" metalness={0.8} /></mesh>
        </group>
      );

    case 'wire':
      return (
        <group>
          <mesh castShadow><boxGeometry args={[cfg.w, cfg.h, cfg.d]} />{mat}</mesh>
        </group>
      );

    default:
      return <mesh castShadow><boxGeometry args={[cfg.w, cfg.h, cfg.d]} />{mat}</mesh>;
  }
}

/* ─────────────────────────────────────────
   FULL APPARATUS (body + terminals + label)
───────────────────────────────────────── */
function Apparatus3D({ item, running, selected, dragging, onBodyPointerDown, onTerminalClick, onRemove }) {
  const cfg = getCFG(item.type);
  const grpRef = useRef();
  const [hov, setHov] = useState(false);

  useFrame(() => {
    if (!grpRef.current) return;
    const targetY = hov || selected ? cfg.h/2 + 0.12 : cfg.h/2;
    grpRef.current.position.y += (targetY - grpRef.current.position.y) * 0.12;
    const targetScale = hov ? 1.06 : 1;
    grpRef.current.scale.x += (targetScale - grpRef.current.scale.x) * 0.12;
    grpRef.current.scale.z += (targetScale - grpRef.current.scale.z) * 0.12;
  });

  return (
    <group position={[item.x, 0, item.y]}>
      {/* Selection ring */}
      {selected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2,0,0]}>
          <ringGeometry args={[Math.max(cfg.w, cfg.d)*0.6, Math.max(cfg.w, cfg.d)*0.6+0.06, 32]} />
          <meshStandardMaterial color="#00c8ff" emissive="#00c8ff" emissiveIntensity={1} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Main group that floats */}
      <group ref={grpRef} position={[0, cfg.h/2, 0]}>
        {/* Clickable body wrapper */}
        <group
          onPointerDown={onBodyPointerDown}
          onPointerOver={(e) => { e.stopPropagation(); setHov(true); document.body.style.cursor='grab'; }}
          onPointerOut={() => { setHov(false); document.body.style.cursor='default'; }}
        >
          <ApparatusBody cfg={cfg} type={item.type} running={running} />
        </group>

        {/* Label */}
        <Suspense fallback={null}>
          <Text position={[0, cfg.h/2+0.22, 0]} rotation={[-Math.PI/2,0,0]} fontSize={0.18} color={cfg.lc} anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000000">
            {cfg.label}
          </Text>
        </Suspense>

        {/* Remove button (small red X sphere) */}
        <mesh position={[cfg.w/2+0.1, cfg.h/2+0.05, -cfg.d/2-0.1]}
          onPointerDown={(e) => { e.stopPropagation(); onRemove(item.id); }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor='pointer'; }}
          onPointerOut={() => { document.body.style.cursor='default'; }}
        >
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#ff3366" emissive="#ff0000" emissiveIntensity={0.8} />
        </mesh>

        {/* Terminals */}
        {cfg.terminals.map(t => (
          <Terminal
            key={t.key}
            position={[t.ox, cfg.h/2+0.05, t.oz]}
            color={t.color}
            onClick={() => {
              const wx = item.x + t.ox;
              const wz = item.y + t.oz;
              onTerminalClick(item.id, t.key, wx, wz);
            }}
          />
        ))}
      </group>
    </group>
  );
}

/* ─────────────────────────────────────────
   WIRE 3D
───────────────────────────────────────── */
function Wire3D({ wire, running }) {
  const points = [
    new THREE.Vector3(wire.fromX, 0.42, wire.fromY),
    new THREE.Vector3((wire.fromX+wire.toX)/2, 0.75, (wire.fromY+wire.toY)/2),
    new THREE.Vector3(wire.toX, 0.42, wire.toY),
  ];
  const curve = new THREE.CatmullRomCurve3(points);
  const curvePoints = curve.getPoints(20);

  return (
    <group>
      <Line points={curvePoints.map(p=>[p.x,p.y,p.z])} color={running ? '#00ffea' : '#00c8ff'} lineWidth={running ? 3 : 2} />
      {running && <Line points={curvePoints.map(p=>[p.x,p.y,p.z])} color="#ffffff" lineWidth={1} transparent opacity={0.4} />}
    </group>
  );
}

/* ─────────────────────────────────────────
   PREVIEW WIRE (mouse follow)
───────────────────────────────────────── */
function PreviewWire3D({ wireStart, floorPlane }) {
  const [endPt, setEndPt] = useState(new THREE.Vector3(wireStart.x, 0.42, wireStart.y));
  const { camera, raycaster } = useThree();
  const tmp = new THREE.Vector3();

  useEffect(() => {
    const onMove = (e) => {
      const canvas = e.target.closest('canvas');
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera({ x, y }, camera);
      if (raycaster.ray.intersectPlane(floorPlane, tmp)) setEndPt(tmp.clone());
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [camera, raycaster, floorPlane]);

  const from = new THREE.Vector3(wireStart.x, 0.42, wireStart.y);
  const points = [from, new THREE.Vector3((from.x+endPt.x)/2, 0.7, (from.z+endPt.z)/2), new THREE.Vector3(endPt.x, 0.42, endPt.z)];
  const curve = new THREE.CatmullRomCurve3(points);

  return <Line points={curve.getPoints(16).map(p=>[p.x,p.y,p.z])} color="#00c8ff" lineWidth={2} dashed dashScale={5} dashSize={0.3} gapSize={0.15} />;
}

/* ─────────────────────────────────────────
   BOARD (floor + grid)
───────────────────────────────────────── */
function Board() {
  return (
    <group>
      {/* Floor plane (Light wooden/gray lab bench) */}
      <mesh receiveShadow position={[0, -0.02, 0]} rotation={[-Math.PI/2,0,0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.05} roughness={0.8} />
      </mesh>
      {/* Grid (subtle on the bright floor) */}
      <Grid position={[0, 0, 0]} args={[30, 20]} cellSize={1} cellThickness={0.5} cellColor="#9ca3af" sectionSize={5} sectionThickness={1} sectionColor="#6b7280" fadeDistance={35} fadeStrength={1} />
    </group>
  );
}

/* ─────────────────────────────────────────
   CAMERA STORE (shares R3F camera outside Canvas)
───────────────────────────────────────── */
function CameraStore({ camRef }) {
  const { camera } = useThree();
  useEffect(() => { camRef.current = camera; }, [camera, camRef]);
  return null;
}

/* ─────────────────────────────────────────
   MAIN 3D SCENE
───────────────────────────────────────── */
const FLOOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

function Scene3D({ items, wires, wireStart, running, onMoveItem, onRemoveItem, onTerminalClick, camRef }) {
  const [draggingId, setDraggingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const orbitRef = useRef();
  const { raycaster, camera } = useThree();
  const tmp = new THREE.Vector3();

  const handleFloorMove = useCallback((e) => {
    if (!draggingId) return;
    if (e.point) {
      onMoveItem(draggingId, e.point.x, e.point.z);
    }
  }, [draggingId, onMoveItem]);

  const handleFloorUp = useCallback(() => {
    setDraggingId(null);
    if (orbitRef.current) orbitRef.current.enabled = true;
  }, []);

  return (
    <>
      <CameraStore camRef={camRef} />

      {/* Lights */}
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight position={[5, 12, 5]} intensity={1.5} color="#ffffff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-6, 6, -6]} intensity={0.5} color="#ffffff" />
      <pointLight position={[6, 4, 6]} intensity={0.5} color="#ffffff" />
      {running && <pointLight position={[0, 5, 0]} intensity={1.5} color="#00ffea" distance={15} />}

      {/* Board */}
      <Board />

      {/* Invisible floor for drag detection */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2,0,0]} visible={false}
        onPointerMove={handleFloorMove}
        onPointerUp={handleFloorUp}
      >
        <planeGeometry args={[22, 16]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </mesh>

      {/* Wires */}
      {wires.map(w => <Wire3D key={w.id} wire={w} running={running} />)}

      {/* Preview wire */}
      {wireStart && <PreviewWire3D wireStart={{ x: wireStart.x, y: wireStart.y }} floorPlane={FLOOR_PLANE} />}

      {/* Apparatus */}
      {items.map(item => (
        <Apparatus3D
          key={item.id}
          item={item}
          running={running}
          selected={selectedId === item.id}
          dragging={draggingId === item.id}
          onBodyPointerDown={(e) => {
            e.stopPropagation();
            setSelectedId(item.id);
            setDraggingId(item.id);
            if (orbitRef.current) orbitRef.current.enabled = false;
          }}
          onTerminalClick={onTerminalClick}
          onRemove={(id) => { onRemoveItem(id); setSelectedId(null); }}
        />
      ))}

      <OrbitControls
        ref={orbitRef}
        makeDefault
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={25}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.08}
        enabled={!wireStart}
      />
    </>
  );
}

/* ─────────────────────────────────────────
   EXPORT: CircuitBoard3D
───────────────────────────────────────── */
export default function CircuitBoard3D({ items, wires, wireStart, running, onAddItem, onMoveItem, onRemoveItem, onTerminalClick }) {
  const containerRef = useRef();
  const camRef = useRef();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('apparatus-type');
    if (!type || !camRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x: ndcX, y: ndcY }, camRef.current);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const pt = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, pt)) {
      onAddItem(type, parseFloat(pt.x.toFixed(3)), parseFloat(pt.z.toFixed(3)));
    }
  }, [onAddItem]);

  return (
    <div
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#e5e7eb' }}
    >
      {/* Wire mode tooltip */}
      {wireStart && (
        <div style={{ position:'absolute', top:12, left:'50%', transform:'translateX(-50%)', zIndex:10, background:'rgba(0,200,255,0.12)', border:'1px solid rgba(0,200,255,0.4)', borderRadius:8, padding:'6px 16px', fontSize:'0.8rem', color:'#00ffea', pointerEvents:'none' }}>
          ⚡ Click another terminal to complete the wire — Esc to cancel
        </div>
      )}

      {/* Empty hint */}
      {items.length === 0 && (
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none', zIndex:5 }}>
          <div style={{ background:'rgba(8,15,30,0.8)', border:'1px dashed rgba(0,200,255,0.2)', borderRadius:16, padding:'28px 44px', textAlign:'center' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:10 }}>🔌</div>
            <div style={{ color:'var(--text-secondary)', fontWeight:600, marginBottom:4 }}>Drag apparatus here</div>
            <div style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>Drop components from the left panel to build your circuit</div>
          </div>
        </div>
      )}

      <Canvas
        shadows
        camera={{ position: [0, 8, 6], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene3D
          items={items}
          wires={wires}
          wireStart={wireStart}
          running={running}
          onMoveItem={onMoveItem}
          onRemoveItem={onRemoveItem}
          onTerminalClick={onTerminalClick}
          camRef={camRef}
        />
      </Canvas>
    </div>
  );
}
