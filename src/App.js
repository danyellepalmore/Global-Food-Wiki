import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Feedback from './pages/Feedback';
import Results from './pages/ResultsDisplay';
import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <Routes>
        {/* Direct to home page on opening */}
        <Route path="/" element={<Home />} />
        {/* Route to results page when search or image upload */}
        <Route path="/resultsdisplay" element={<Results />} />
        {/* Route to feedback page when "provide feedback" is clidked */}"
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </div>
  );
}

export default App;
