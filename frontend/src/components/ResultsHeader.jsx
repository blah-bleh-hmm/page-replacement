import React from 'react';
import PropTypes from 'prop-types';

const ResultsHeader = ({ resultsCount, onBack }) => (
  <div className='panel__header'>
    <div>
      <p className='eyebrow'>Results</p>
      <h2>Simulation outcomes</h2>
      <p className='muted'>
        {resultsCount > 0
          ? `${resultsCount} algorithm${resultsCount === 1 ? '' : 's'} evaluated.`
          : 'Run a simulation to see results.'}
      </p>
    </div>
    {onBack && (
      <button className='ghost' onClick={onBack} type='button'>
        Back to inputs
      </button>
    )}
  </div>
);

ResultsHeader.propTypes = {
  resultsCount: PropTypes.number.isRequired,
  onBack: PropTypes.func,
};

export default ResultsHeader;
