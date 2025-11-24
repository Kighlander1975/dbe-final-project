// src/components/LoadingOverlay.jsx
import React from 'react';
import { useLoading } from '../context/LoadingContext';
import '../styles/components/loading.css';

function LoadingOverlay() {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-overlay__content">
        <div className="loading-overlay__spinner"></div>
        <p className="loading-overlay__message">{loadingMessage}</p>
      </div>
    </div>
  );
}

export default LoadingOverlay;