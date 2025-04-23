// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Recommendations from './pages/Recommendations';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#333' }}>
        <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
        <Link to="/recommendations" style={{ color: 'white' }}>Recommendations</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </Router>
  );
}

export default App;