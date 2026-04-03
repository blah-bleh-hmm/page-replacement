import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const steps = [
  { path: '/', label: 'Input', step: 1 },
  { path: '/results', label: 'Results', step: 2 },
  { path: '/comparison', label: 'Comparison', step: 3 },
  { path: '/history', label: 'History', step: 4 },
];

const Navbar = ({
  theme,
  onThemeChange,
  currentPath,
  canViewComparison,
  onNavigate,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentStep = steps.findIndex((s) => s.path === location.pathname);

  const handleNavigation = (path, isLocked) => {
    if (isLocked) return;
    navigate(path);
  };

  return (
    <nav className='navbar'>
      <div className='navbar-inner'>
        <div className='navbar-brand'>
          <span className='brand-icon'>⚙️</span>
          <span className='brand-text'>Page Replacement Simulator</span>
        </div>

        <div className='navbar-steps'>
          {steps.map((s, i) => {
            const isLocked =
              (s.path === '/results' || s.path === '/comparison') &&
              !canViewComparison;

            return (
              <button
                key={s.path}
                onClick={() => handleNavigation(s.path, isLocked)}
                disabled={isLocked}
                className={`step-item ${i === currentStep ? 'active' : ''} ${
                  i < currentStep ? 'completed' : ''
                } ${isLocked ? 'disabled' : ''}`}
              >
                <span className='step-number'>{s.step}</span>
                <span className='step-label'>{s.label}</span>
              </button>
            );
          })}
        </div>

        <button
          className='theme-toggle'
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label='Toggle theme'
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
