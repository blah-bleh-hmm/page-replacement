import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner.jsx';

const AlgorithmSelector = ({
  algorithms,
  selectedAlgorithms,
  onToggleAlgorithm,
  onSelectAll,
  loading,
}) => (
  <div className='algorithms'>
    <div className='algorithms__header'>
      <div>
        <p className='eyebrow'>Algorithms</p>
        <h3>Select one or many</h3>
      </div>
      <button className='ghost' onClick={onSelectAll} type='button'>
        Select all
      </button>
    </div>
    <div className='algorithms__list'>
      {loading ? (
        <LoadingSpinner label='Loading algorithms...' />
      ) : (
        algorithms.map((algo) => (
          <label
            key={algo.key}
            className={`pill ${selectedAlgorithms.has(algo.key) ? 'pill--on' : 'pill--off'}`}
          >
            <input
              type='checkbox'
              checked={selectedAlgorithms.has(algo.key)}
              onChange={() => onToggleAlgorithm(algo.key)}
              disabled={loading}
            />
            <span>{algo.label}</span>
          </label>
        ))
      )}
      {algorithms.length === 0 && !loading && (
        <p className='muted'>No algorithms available.</p>
      )}
    </div>
  </div>
);

AlgorithmSelector.propTypes = {
  algorithms: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
    }),
  ).isRequired,
  selectedAlgorithms: PropTypes.instanceOf(Set).isRequired,
  onToggleAlgorithm: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

AlgorithmSelector.defaultProps = {
  loading: false,
};

export default AlgorithmSelector;
