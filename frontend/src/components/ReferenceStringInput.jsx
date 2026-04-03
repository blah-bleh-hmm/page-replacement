import React from 'react';
import PropTypes from 'prop-types';

const ReferenceStringInput = ({
  form,
  onFormChange,
  onSubmit,
  onLoadDummy,
  loading,
}) => (
  <div className='form-fields'>
    <label className='field'>
      <span>Frame size</span>
      <input
        type='number'
        min='1'
        value={form.frameSize}
        onChange={(e) =>
          onFormChange({ ...form, frameSize: Number(e.target.value) })
        }
      />
    </label>
    <label className='field'>
      <span>Number of pages (optional)</span>
      <input
        type='number'
        min='1'
        value={form.numPages}
        onChange={(e) => onFormChange({ ...form, numPages: e.target.value })}
        placeholder='Auto-detected from reference string'
      />
    </label>
    <label className='field'>
      <span>Page reference string (space or comma separated)</span>
      <textarea
        rows='4'
        value={form.referenceString}
        onChange={(e) =>
          onFormChange({ ...form, referenceString: e.target.value })
        }
        placeholder='e.g. 7 0 1 2 0 3 0 4 2 3'
      />
    </label>
    <div className='actions'>
      <button className='primary' onClick={onSubmit} disabled={loading}>
        {loading ? 'Running...' : 'Run Simulation'}
      </button>
      <button
        className='ghost'
        onClick={onLoadDummy}
        type='button'
        disabled={loading}
      >
        Load Dummy Data
      </button>
    </div>
  </div>
);

ReferenceStringInput.propTypes = {
  form: PropTypes.shape({
    frameSize: PropTypes.number.isRequired,
    numPages: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    referenceString: PropTypes.string.isRequired,
  }).isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onLoadDummy: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ReferenceStringInput;
