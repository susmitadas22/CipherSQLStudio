import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignmentService } from '../../services';
import AssignmentCard from '../../components/AssignmentCard/AssignmentCard';
import './AssignmentList.scss';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAllAssignments();
      setAssignments(data.assignments || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load assignments');
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentClick = (id) => {
    navigate(`/assignment/${id}`);
  };

  const filteredAssignments = filter === 'All' 
    ? assignments 
    : assignments.filter(a => a.difficulty === filter);

  if (loading) {
    return (
      <div className="assignment-list">
        <div className="assignment-list__loading">
          <div className="spinner"></div>
          <p>Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignment-list">
        <div className="assignment-list__error">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={fetchAssignments} className="button button--primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-list">
      <div className="assignment-list__header">
        <div className="assignment-list__intro">
          <h1 className="assignment-list__title">SQL Assignments</h1>
          <p className="assignment-list__subtitle">
            Practice SQL queries with real-time execution and get intelligent hints when you're stuck
          </p>
        </div>

        <div className="assignment-list__filters">
          <button 
            className={`filter-button ${filter === 'All' ? 'filter-button--active' : ''}`}
            onClick={() => setFilter('All')}
          >
            All ({assignments.length})
          </button>
          <button 
            className={`filter-button ${filter === 'Easy' ? 'filter-button--active' : ''}`}
            onClick={() => setFilter('Easy')}
          >
            Easy ({assignments.filter(a => a.difficulty === 'Easy').length})
          </button>
          <button 
            className={`filter-button ${filter === 'Medium' ? 'filter-button--active' : ''}`}
            onClick={() => setFilter('Medium')}
          >
            Medium ({assignments.filter(a => a.difficulty === 'Medium').length})
          </button>
          <button 
            className={`filter-button ${filter === 'Hard' ? 'filter-button--active' : ''}`}
            onClick={() => setFilter('Hard')}
          >
            Hard ({assignments.filter(a => a.difficulty === 'Hard').length})
          </button>
        </div>
      </div>

      <div className="assignment-list__grid">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              onClick={() => handleAssignmentClick(assignment._id)}
            />
          ))
        ) : (
          <div className="assignment-list__empty">
            <p>No assignments found for this difficulty level.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentList;
