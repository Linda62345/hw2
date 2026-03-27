import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FirstPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      // Calls the Express backend
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setResults(data);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const navigateToDetails = (studentId, semester) => {
    navigate(`/enrollment?studentId=${studentId}&semester=${semester}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Homework Assignment #2: Web Programming Exercise</h1>
      <h2>The First Webpage (Search)</h2>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Enter student ID or name" 
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '5px 15px' }}>find</button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', minWidth: '300px' }}>
        <thead>
          <tr style={{ backgroundColor: '#808080', color: 'white' }}>
            <th colSpan="2">Enrollments</th>
          </tr>
          <tr style={{ backgroundColor: '#A9A9A9', color: 'white' }}>
            <th>Semester</th>
            <th>ID/name</th>
          </tr>
        </thead>
        <tbody>
          {!hasSearched && results.length === 0 && (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>No Entry</td>
            </tr>
          )}
          {hasSearched && results.length === 0 && (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>No records found</td>
            </tr>
          )}
          {results.map((row, index) => (
            <tr key={index}>
              <td 
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} 
                onClick={() => navigateToDetails(row.student_id, row.semester)}
              >
                {row.semester}
              </td>
              <td>{row.student_id}/{row.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FirstPage;
