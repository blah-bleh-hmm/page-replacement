import React from 'react';
import PropTypes from 'prop-types';
import BestRunBanner from '../components/BestRunBanner.jsx';
import ComparisonTable from '../components/ComparisonTable.jsx';
import StepsViewer from '../components/StepsViewer.jsx';

const Comparisons = ({ results, onNavigate }) => {
  const bestRun =
    results.length > 0
      ? results.reduce(
          (best, run) =>
            run.summary.faults < best.summary.faults ? run : best,
          results[0],
        )
      : null;

  return (
    <>
      <section className='panel glassy'>
        <div className='panel__header'>
          <div>
            <p className='eyebrow'>Comparisons</p>
            <h2>Side-by-side results</h2>
          </div>
          <button className='ghost' onClick={() => onNavigate('home')}>
            Back to inputs
          </button>
        </div>
        <BestRunBanner bestRun={bestRun} />
        {results.length ? (
          <ComparisonTable runs={results} />
        ) : (
          <p className='muted'>Run a simulation to see comparisons.</p>
        )}
      </section>
    </>
  );
};

Comparisons.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      algorithm: PropTypes.string.isRequired,
      summary: PropTypes.shape({
        faults: PropTypes.number.isRequired,
        hits: PropTypes.number.isRequired,
        hitRatio: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
      }).isRequired,
      steps: PropTypes.arrayOf(
        PropTypes.shape({
          index: PropTypes.number.isRequired,
          page: PropTypes.number.isRequired,
          frames: PropTypes.arrayOf(PropTypes.number).isRequired,
          hit: PropTypes.bool.isRequired,
          replaced: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.oneOf([null]),
          ]),
        }),
      ).isRequired,
    }),
  ).isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default Comparisons;
