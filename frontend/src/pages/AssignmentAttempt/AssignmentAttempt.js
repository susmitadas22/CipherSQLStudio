import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assignmentService, queryService } from '../../services';
import SQLEditor from '../../components/SQLEditor/SQLEditor';
import ResultsPanel from '../../components/ResultsPanel/ResultsPanel';
import SampleDataViewer from '../../components/SampleDataViewer/SampleDataViewer';
import './AssignmentAttempt.scss';

const AssignmentAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState(null);
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAssignment(id);
      setAssignment(data.assignment);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load assignment');
      console.error('Error fetching assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      alert('Please write a SQL query first');
      return;
    }

    try {
      setExecuting(true);
      setResult(null);
      const data = await queryService.executeQuery(query, id);
      setResult(data);
    } catch (err) {
      setResult({
        success: false,
        error: err.response?.data?.error || 'Failed to execute query',
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleGetHint = async () => {
    try {
      setLoadingHint(true);
      const data = await queryService.getHint(id, query);
      setHint(data.hint);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate hint');
    } finally {
      setLoadingHint(false);
    }
  };

  const handleClearQuery = () => {
    if (window.confirm('Are you sure you want to clear your query?')) {
      setQuery('');
      setResult(null);
      setHint(null);
    }
  };

  if (loading) {
    return (
      <div className="assignment-attempt">
        <div className="assignment-attempt__loading">
          <div className="spinner"></div>
          <p>Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="assignment-attempt">
        <div className="assignment-attempt__error">
          <h2>❌ Error</h2>
          <p>{error || 'Assignment not found'}</p>
          <button onClick={() => navigate('/')} className="button button--primary">
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-attempt">
      <div className="assignment-attempt__container">
        {/* Left Panel - Question & Sample Data */}
        <div className="assignment-attempt__question-panel">
          <button 
            onClick={() => navigate('/')} 
            className="assignment-attempt__back"
          >
            ← Back to Assignments
          </button>

          <div className="assignment-attempt__question">
            <div className="assignment-attempt__header">
              <h1 className="assignment-attempt__title">{assignment.title}</h1>
              <span className={`difficulty-badge difficulty-badge--${assignment.difficulty.toLowerCase()}`}>
                {assignment.difficulty}
              </span>
            </div>

            <div className="assignment-attempt__question-content">
              <h3>📋 Question:</h3>
              <p>{assignment.question}</p>
            </div>

            {assignment.requirements && assignment.requirements.length > 0 && (
              <div className="assignment-attempt__requirements">
                <h3>✅ Requirements:</h3>
                <ul>
                  {assignment.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <SampleDataViewer tableSchemas={assignment.tableSchemas} />
        </div>

        {/* Right Panel - Editor & Results */}
        <div className="assignment-attempt__work-panel">
          <div className="assignment-attempt__editor-section">
            <SQLEditor 
              value={query} 
              onChange={setQuery}
            />
            
            <div className="assignment-attempt__actions">
              <button 
                onClick={handleExecuteQuery}
                disabled={executing || !query.trim()}
                className="button button--primary button--execute"
              >
                {executing ? '⏳ Executing...' : '▶️ Execute Query'}
              </button>
              
              <button 
                onClick={handleGetHint}
                disabled={loadingHint}
                className="button button--secondary"
              >
                {loadingHint ? '🤔 Thinking...' : '💡 Get Hint'}
              </button>
              
              <button 
                onClick={handleClearQuery}
                disabled={!query.trim()}
                className="button button--outline"
              >
                🗑️ Clear
              </button>
            </div>

            {hint && (
              <div className="assignment-attempt__hint">
                <h4>💡 Hint:</h4>
                <p>{hint}</p>
                <button 
                  onClick={() => setHint(null)}
                  className="assignment-attempt__hint-close"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="assignment-attempt__results-section">
            <h3 className="assignment-attempt__results-title">Query Results</h3>
            <ResultsPanel 
              result={result}
              loading={executing}
              error={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentAttempt;
