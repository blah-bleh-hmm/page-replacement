import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const PAGE_SIZE_OPTIONS = [25, 50, 100];
const DEFAULT_PAGE_SIZE = 50;

const StepsViewer = ({ runs }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const totalSteps = runs.length ? runs[0].steps.length : 0;
  const totalPages = totalSteps ? Math.ceil(totalSteps / pageSize) : 1;

  useEffect(() => {
    setPage(0);
  }, [runs, pageSize]);

  const paginatedRuns = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return runs.map((run) => ({
      ...run,
      steps: run.steps.slice(start, end),
    }));
  }, [runs, page, pageSize]);

  const startStep = totalSteps === 0 ? 0 : page * pageSize + 1;
  const endStep =
    totalSteps === 0 ? 0 : Math.min(totalSteps, (page + 1) * pageSize);

  return (
    <div className='stack'>
      <div className='pagination-controls'>
        <div className='muted'>
          Showing steps {startStep} – {endStep} of {totalSteps}
        </div>
        <div className='pagination-actions'>
          <label className='field-inline'>
            <span>Page size</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option value={size} key={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <div className='pagination-buttons'>
            <button
              type='button'
              className='ghost'
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={page === 0}
            >
              Previous
            </button>
            <span className='muted'>Page {page + 1}</span>
            <button
              type='button'
              className='ghost'
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages - 1, Math.max(0, current + 1)),
                )
              }
              disabled={page >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className='grid'>
        {paginatedRuns.map((run) => (
          <div key={run.key} className='card'>
            <header className='card__header'>
              <div>
                <h3 className='algo-tag'>{run.algorithm}</h3>
                <p>Steps</p>
              </div>
              <div className='tags'>
                <span className='tag success'>Hits {run.summary.hits}</span>
                <span className='tag warn'>Faults {run.summary.faults}</span>
                <span className='tag hit-ratio'>
                  Hit ratio {run.summary.hitRatio}
                </span>
              </div>
            </header>
            <div className='table-scroll'>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Page</th>
                    <th>Frames</th>
                    <th>Status</th>
                    <th>Replaced</th>
                  </tr>
                </thead>
                <tbody>
                  {run.steps.map((step) => (
                    <tr
                      key={`${run.key}-${step.index}`}
                      className={step.hit ? 'hit' : 'fault'}
                    >
                      <td>{step.index + 1}</td>
                      <td>{step.page}</td>
                      <td>{step.frames.join(' , ')}</td>
                      <td>{step.hit ? 'Hit' : 'Fault'}</td>
                      <td>{step.replaced ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

StepsViewer.propTypes = {
  runs: PropTypes.arrayOf(
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
};

export default React.memo(StepsViewer);
