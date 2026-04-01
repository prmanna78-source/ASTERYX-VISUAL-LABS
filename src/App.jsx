import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import ExperimentPage from './pages/ExperimentPage';
import Preloader from './components/Preloader';
import './index.css';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show preloader animation on startup
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AnimatePresence>
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lab/:experimentId" element={<ExperimentPage />} />
      </Routes>
    </BrowserRouter>
  );
}
