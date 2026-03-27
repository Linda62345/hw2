const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Search endpoint (First Page)
// Search by either student ID or name
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json([]);
  }

  try {
    // Note: Spec says many-to-many relationship, so a single student might take multiple courses in one semester.
    // If the table displays unique combinations of student and semester, we group or distinctly query.
    const [rows] = await db.query(`
      SELECT DISTINCT s.student_id, s.name, se.semester
      FROM students s
      JOIN student_enrollments se ON s.student_id = se.student_id
      WHERE s.student_id = ? OR s.name = ?
      ORDER BY se.semester DESC
    `, [q, q]);

    res.json(rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. Details endpoint (Second Page)
// Fetch a specific student's info and courses for a given semester
app.get('/api/details', async (req, res) => {
  const { studentId, semester } = req.query;

  if (!studentId || !semester) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // Get student details
    const [studentRows] = await db.query('SELECT name FROM students WHERE student_id = ?', [studentId]);
    if (studentRows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get courses for that semester
    const [courseRows] = await db.query(`
      SELECT c.course_id, c.course_name 
      FROM courses c
      JOIN student_enrollments se ON c.course_id = se.course_id
      WHERE se.student_id = ? AND se.semester = ?
    `, [studentId, semester]);

    res.json({
      name: studentRows[0].name,
      courses: courseRows
    });
  } catch (error) {
    console.error('Details error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
