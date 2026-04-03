import { useEffect, useReducer } from 'react';
import { fetchAlgorithms } from '../services/api.js';

export const initialState = {
  form: { frameSize: 3, numPages: '', referenceString: '' },
  selectedAlgorithms: new Set(),
  algorithms: [],
  results: [],
  loading: false,
  algorithmsLoading: false,
  theme: 'dark',
};

const ACTIONS = {
  SET_FORM: 'SET_FORM',
  SET_SELECTED_ALGORITHMS: 'SET_SELECTED_ALGORITHMS',
  SET_RESULTS: 'SET_RESULTS',
  SET_LOADING: 'SET_LOADING',
  SET_THEME: 'SET_THEME',
  SET_ALGORITHMS: 'SET_ALGORITHMS',
  TOGGLE_ALGORITHM: 'TOGGLE_ALGORITHM',
  SELECT_ALL: 'SELECT_ALL',
  SET_ALGORITHMS_LOADING: 'SET_ALGORITHMS_LOADING',
};

export function simulationReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_FORM:
      return { ...state, form: action.payload };
    case ACTIONS.SET_SELECTED_ALGORITHMS:
      return { ...state, selectedAlgorithms: new Set(action.payload) };
    case ACTIONS.SET_RESULTS:
      return { ...state, results: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ALGORITHMS_LOADING:
      return { ...state, algorithmsLoading: action.payload };
    case ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };
    case ACTIONS.SET_ALGORITHMS:
      return {
        ...state,
        algorithms: action.payload.algorithms,
        selectedAlgorithms: new Set(action.payload.defaultSelection),
      };
    case ACTIONS.TOGGLE_ALGORITHM: {
      const updated = new Set(state.selectedAlgorithms);
      updated.has(action.payload)
        ? updated.delete(action.payload)
        : updated.add(action.payload);
      return { ...state, selectedAlgorithms: updated };
    }
    case ACTIONS.SELECT_ALL:
      return { ...state, selectedAlgorithms: new Set(action.payload) };
    default:
      return state;
  }
}

const useSimulationState = () => {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  useEffect(() => {
    const loadAlgorithms = async () => {
      dispatch({ type: ACTIONS.SET_ALGORITHMS_LOADING, payload: true });
      try {
        const data = await fetchAlgorithms();
        const algorithms = data.algorithms || [];
        dispatch({
          type: ACTIONS.SET_ALGORITHMS,
          payload: {
            algorithms,
            defaultSelection: algorithms.map((algo) => algo.key),
          },
        });
      } catch (err) {
        console.error('Failed to fetch algorithms', err);
      } finally {
        dispatch({ type: ACTIONS.SET_ALGORITHMS_LOADING, payload: false });
      }
    };

    loadAlgorithms();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const setForm = (form) => dispatch({ type: ACTIONS.SET_FORM, payload: form });
  const setSelectedAlgorithms = (selected) =>
    dispatch({ type: ACTIONS.SET_SELECTED_ALGORITHMS, payload: selected });
  const setResults = (results) =>
    dispatch({ type: ACTIONS.SET_RESULTS, payload: results });
  const setLoading = (loading) =>
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  const setTheme = (theme) =>
    dispatch({ type: ACTIONS.SET_THEME, payload: theme });
  const toggleAlgorithm = (key) =>
    dispatch({ type: ACTIONS.TOGGLE_ALGORITHM, payload: key });
  const selectAllAlgorithms = () =>
    dispatch({
      type: ACTIONS.SELECT_ALL,
      payload: state.algorithms.map((algo) => algo.key),
    });

  return {
    state,
    setForm,
    setSelectedAlgorithms,
    setResults,
    setLoading,
    setTheme,
    toggleAlgorithm,
    selectAllAlgorithms,
  };
};

export default useSimulationState;
