import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InputForm from '../components/InputForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { runSimulation } from '../services/api.js';
import { parseReferenceString } from '../utils/parsing.js';

const Home = ({
  state,
  setForm,
  setSelectedAlgorithms,
  onToggleAlgorithm,
  onSelectAll,
  setLoading,
  onNavigate,
}) => {
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const loadDummyData = () => {
    const sampleString = '7 0 1 2 0 3 0 4 2 3 0 3 2';
    setForm({ frameSize: 3, numPages: 13, referenceString: sampleString });
    setInfo('Loaded sample reference string (kept your algorithm selection).');
  };

  const handleSubmit = async () => {
    setError('');
    setInfo('');
    const pages = parseReferenceString(state.form.referenceString);
    const frameSize = Number(state.form.frameSize);

    if (!frameSize || frameSize <= 0) {
      setError('Frame size must be greater than zero.');
      return;
    }
    if (!pages.length) {
      setError('Enter at least one page in the reference string.');
      return;
    }
    if (state.form.numPages && Number(state.form.numPages) !== pages.length) {
      setError('Number of pages does not match the reference string length.');
      return;
    }
    if (state.selectedAlgorithms.size === 0) {
      setError('Select at least one algorithm to run.');
      return;
    }

    setLoading(true);
    try {
      const data = await runSimulation(
        frameSize,
        pages,
        Array.from(state.selectedAlgorithms),
      );
      setInfo(data.saved ? 'Saved to history.' : 'Simulation complete.');
      onNavigate('results', data.runs || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='panel rainbow'>
      <InputForm
        form={state.form}
        setForm={setForm}
        algorithms={state.algorithms}
        selectedAlgorithms={state.selectedAlgorithms}
        onToggleAlgorithm={onToggleAlgorithm}
        onSelectAll={onSelectAll}
        onSubmit={handleSubmit}
        onLoadDummy={loadDummyData}
        loading={state.loading}
        algorithmsLoading={state.algorithmsLoading}
      />
      {state.algorithmsLoading && !state.loading && (
        <div className='loading-row'>
          <LoadingSpinner label='Loading algorithms...' />
        </div>
      )}
      {state.loading && (
        <div className='loading-row'>
          <LoadingSpinner label='Running simulation...' />
        </div>
      )}
      {error && <div className='alert error'>{error}</div>}
      {info && <div className='alert info'>{info}</div>}
    </section>
  );
};

Home.propTypes = {
  state: PropTypes.shape({
    form: PropTypes.shape({
      frameSize: PropTypes.number.isRequired,
      numPages: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      referenceString: PropTypes.string.isRequired,
    }).isRequired,
    selectedAlgorithms: PropTypes.instanceOf(Set).isRequired,
    algorithms: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string,
      }),
    ),
    loading: PropTypes.bool,
    algorithmsLoading: PropTypes.bool,
  }).isRequired,
  setForm: PropTypes.func.isRequired,
  setSelectedAlgorithms: PropTypes.func.isRequired,
  onToggleAlgorithm: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default Home;
