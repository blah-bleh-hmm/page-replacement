import React from 'react';
import PropTypes from 'prop-types';

const BestRunBanner = ({ bestRun }) => {
  if (!bestRun) return null;

  return (
    <div className='best-banner'>
      <div className='best-badge' aria-hidden>
        ✨
      </div>
      <div>
        <p className='eyebrow'>Top performer</p>
        <h3>{bestRun.algorithm}</h3>
        <p className='muted'>
          {bestRun.summary.faults} faults · {bestRun.summary.hits} hits · Hit
          ratio {bestRun.summary.hitRatio}
        </p>
      </div>
    </div>
  );
};

BestRunBanner.propTypes = {
  bestRun: PropTypes.shape({
    algorithm: PropTypes.string.isRequired,
    summary: PropTypes.shape({
      faults: PropTypes.number.isRequired,
      hits: PropTypes.number.isRequired,
      hitRatio: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    }).isRequired,
  }),
};

export default BestRunBanner;
