import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ label }) => (
  <div className='spinner' role='status' aria-live='polite'>
    <span className='spinner__circle' />
    {label ? <span className='spinner__label'>{label}</span> : null}
  </div>
);

LoadingSpinner.propTypes = {
  label: PropTypes.string,
};

LoadingSpinner.defaultProps = {
  label: 'Loading...',
};

export default LoadingSpinner;
