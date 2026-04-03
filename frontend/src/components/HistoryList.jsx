import React from 'react';

const HistoryList = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <p className='muted'>No history yet. Run a simulation to see it here.</p>
    );
  }

  return (
    <div className='history'>
      {history.map((item, idx) => (
        <div key={item._id || idx} className='history__item'>
          <div>
            <p className='eyebrow'>Frames {item.frameSize}</p>
            <h4>
              {item.pages.length} pages • {item.algorithms.join(', ')}
            </h4>
            <p className='muted'>{new Date(item.createdAt).toLocaleString()}</p>
          </div>
          <div className='history__metrics'>
            {item.runs &&
              item.runs.slice(0, 3).map((run) => (
                <span key={run.algorithm} className='tag'>
                  {run.algorithm}: faults {run.summary?.faults ?? '—'}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
