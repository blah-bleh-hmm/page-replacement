import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Results from './pages/Results.jsx';
import Comparisons from './pages/Comparisons.jsx';
import History from './pages/History.jsx';
import NotFound from './pages/NotFound.jsx';
import useSimulationState from './hooks/useSimulationState.js';

function AppContent() {
  const {
    state,
    setForm,
    setSelectedAlgorithms,
    setResults,
    setLoading,
    setTheme,
    toggleAlgorithm,
    selectAllAlgorithms,
  } = useSimulationState();

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page, data = null) => {
    if (page === 'results' && data) setResults(data);
    navigate(page === 'home' ? '/' : `/${page}`);
  };

  return (
    <div className='app-shell'>
      <Navbar
        theme={state.theme}
        onThemeChange={setTheme}
        currentPath={location.pathname}
        canViewComparison={state.results.length > 0}
        onNavigate={navigate}
      />

      <Routes>
        <Route
          path='/'
          element={
            <Home
              state={state}
              setForm={setForm}
              setSelectedAlgorithms={setSelectedAlgorithms}
              onToggleAlgorithm={toggleAlgorithm}
              onSelectAll={selectAllAlgorithms}
              setLoading={setLoading}
              onNavigate={handleNavigate}
            />
          }
        />
        <Route
          path='/results'
          element={
            <Results results={state.results} onNavigate={handleNavigate} />
          }
        />
        <Route
          path='/comparison'
          element={
            <Comparisons results={state.results} onNavigate={handleNavigate} />
          }
        />
        <Route path='/history' element={<History />} />
        <Route path='*' element={<NotFound onNavigate={handleNavigate} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
