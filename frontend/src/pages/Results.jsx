import React from 'react';
import PropTypes from 'prop-types';
import BestRunBanner from '../components/BestRunBanner.jsx';
import ResultsHeader from '../components/ResultsHeader.jsx';
import StepsViewer from '../components/StepsViewer.jsx';

const Results = ({ results, onNavigate }) => {
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


      {results.length > 0 && (
        <section className='panel rainbow'>
          <div className='panel__header'>
            <div>
              <p className='eyebrow'>Timeline</p>
              <h2>Step-by-step frames</h2>
            </div>
            <button
              className='ghost'
              onClick={() => onNavigate('comparison')}
              type='button'
            >
              View comparisons
            </button>
          </div>
          <StepsViewer runs={results} />
        </section>
      )}
    </>
  );
};

Results.propTypes = {
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

export default Results;
