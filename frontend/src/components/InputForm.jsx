import React from 'react';
import PropTypes from 'prop-types';
import AlgorithmSelector from './AlgorithmSelector.jsx';
import ReferenceStringInput from './ReferenceStringInput.jsx';

const InputForm = ({
  form,
  setForm,
  algorithms,
  selectedAlgorithms,
  onToggleAlgorithm,
  onSelectAll,
  onSubmit,
  onLoadDummy,
  loading,
  algorithmsLoading,
}) => (
  <div className='form-grid'>
    <div className='form-column'>
      <ReferenceStringInput
        form={form}
        onFormChange={setForm}
        onSubmit={onSubmit}
        onLoadDummy={onLoadDummy}
        loading={loading}
      />
    </div>

    <div className='form-column'>
      <AlgorithmSelector
        algorithms={algorithms}
        selectedAlgorithms={selectedAlgorithms}
        onToggleAlgorithm={onToggleAlgorithm}
        onSelectAll={onSelectAll}
        loading={algorithmsLoading}
      />
    </div>
  </div>
);

InputForm.propTypes = {
  form: PropTypes.shape({
    frameSize: PropTypes.number.isRequired,
    numPages: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    referenceString: PropTypes.string.isRequired,
  }).isRequired,
  setForm: PropTypes.func.isRequired,
  algorithms: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
    }),
  ).isRequired,
  selectedAlgorithms: PropTypes.instanceOf(Set).isRequired,
  onToggleAlgorithm: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onLoadDummy: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  algorithmsLoading: PropTypes.bool.isRequired,
};

export default InputForm;
