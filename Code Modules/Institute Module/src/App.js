import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Map from './Map';
import InstituteCard from './InstituteCard';

function App() {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3009/api/institutes')
      .then(response => {
        setInstitutes(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching the institutes data: {error.message}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Famous Institutes for Hearing-Impaired Individuals in Pakistan</h2>
      </header>
      <div className="content">
        <div className="left-section">
          <Map institutes={institutes} />
        </div>
        <div className="right-section">
          {institutes.map((institute, index) => (
            <InstituteCard key={index} institute={institute} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
