import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function SecondPage() {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId');
  const semester = searchParams.get('semester');
  const navigate = useNavigate();
  
  const [details, setDetails] = useState({
    name: '',
    courses: []
  });

  useEffect(() => {
    if (!studentId || !semester) return;

    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/details?studentId=${studentId}&semester=${semester}`);
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchDetails();
  }, [studentId, semester]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Homework Assignment #2: Web Programming Exercise</h1>
      <h2>The Second Webpage (Details)</h2>
      
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>&larr; Back to Search</button>

      {details.name ? (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', minWidth: '300px' }}>
          <thead>
            <tr style={{ backgroundColor: '#A9A9A9', color: 'white' }}>
              <th colSpan="2">Enrollment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Semester</td>
              <td>{semester}</td>
            </tr>
            <tr>
              <td>ID/name</td>
              <td>{studentId}/{details.name}</td>
            </tr>
            <tr>
              <td>Courses</td>
              <td>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {details.courses.length > 0 ? (
                    details.courses.map((course, index) => (
                      <li key={index}>{course.course_name}</li>
                    ))
                  ) : (
                    <li>No courses found.</li>
                  )}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading or Record not found...</p>
      )}
    </div>
  );
}

export default SecondPage;
