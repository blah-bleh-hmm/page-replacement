import React, { useEffect, useState } from 'react';
import HistoryList from '../components/HistoryList.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { fetchHistory } from '../services/api.js';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const items = await fetchHistory();
      setHistory(items);
    } catch (err) {
      setError(err.message || 'Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <section className='panel rainbow'>
      <div className='panel__header'>
        <div>
          <p className='eyebrow'>History</p>
          <h2>Recent simulations</h2>
        </div>
        <button className='ghost' type='button' onClick={loadHistory}>
          Refresh
        </button>
      </div>

      {error && <div className='alert error'>{error}</div>}
      {loading ? (
        <LoadingSpinner label='Loading history...' />
      ) : (
        <HistoryList history={history} />
      )}
    </section>
  );
};

export default History;
