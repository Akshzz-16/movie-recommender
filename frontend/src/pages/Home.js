// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Movie Recommender System</h1>
      <Link to="/recommendations">
        <button>Get Recommendations</button>
      </Link>
    </div>
  );
};

export default Home;