import React from 'react';
import PropTypes from 'prop-types';

const ComparisonTable = ({ runs }) => {
  if (!runs.length) return null;
  const minFaults = Math.min(...runs.map((r) => r.summary.faults));
  const maxFaults = Math.max(...runs.map((r) => r.summary.faults));
  const maxHits = Math.max(...runs.map((r) => r.summary.hits));

  const faultWinners = new Set(
    runs.filter((r) => r.summary.faults === minFaults).map((r) => r.key),
  );

  const faultScale = (value) =>
    maxFaults === 0 ? 0 : Math.round((value / maxFaults) * 100);
  const hitScale = (value) =>
    maxHits === 0 ? 0 : Math.round((value / maxHits) * 100);

  return (
    <div className='table-scroll'>
      <table className='comparison-table'>
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Page faults</th>
            <th>Hits</th>
            <th>Hit ratio</th>
            <th>Efficiency</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => {
            const best = run.summary.faults === minFaults;
            return (
              <tr key={run.key} className={best ? 'best' : ''}>
                <td className={best ? 'cell-best' : ''}>{run.algorithm}</td>
                <td
                  className={faultWinners.has(run.key) ? 'cell-highlight' : ''}
                >
                  <div className='metric'>
                    <span>{run.summary.faults}</span>
                    <div
                      className='bar bg-warn'
                      style={{ width: `${faultScale(run.summary.faults)}%` }}
                    />
                  </div>
                </td>
                <td
                  className={
                    faultWinners.has(run.key) ? 'cell-highlight-soft' : ''
                  }
                >
                  <div className='metric'>
                    <span>{run.summary.hits}</span>
                    <div
                      className='bar bg-success'
                      style={{ width: `${hitScale(run.summary.hits)}%` }}
                    />
                  </div>
                </td>
                <td>{run.summary.hitRatio}</td>
                <td className={best ? 'cell-flag' : ''}>
                  {best ? '🏅 Best (fewest faults)' : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

ComparisonTable.propTypes = {
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
    }),
  ).isRequired,
};

export default React.memo(ComparisonTable);
