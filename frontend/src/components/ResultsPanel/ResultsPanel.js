import React from 'react';
import './ResultsPanel.scss';

const ResultsPanel = ({ result, loading, error }) => {
  if (loading) {
    return (
      <div className="results-panel">
        <div className="results-panel__loading">
          <div className="spinner"></div>
          <p>Executing query...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-panel">
        <div className="results-panel__error">
          <h4>❌ Error</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-panel">
        <div className="results-panel__empty">
          <p>💡 Write a query and click "Execute" to see results</p>
        </div>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="results-panel">
        <div className="results-panel__error">
          <h4>❌ Query Error</h4>
          <p>{result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <div className="results-panel__header">
        <h4>✅ Query Results</h4>
        <div className="results-panel__meta">
          <span>{result.rowCount} rows</span>
          <span>•</span>
          <span>{result.executionTime}ms</span>
        </div>
      </div>

      {result.rows && result.rows.length > 0 ? (
        <div className="results-panel__table-wrapper">
          <table className="results-panel__table">
            <thead>
              <tr>
                {Object.keys(result.rows[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex}>
                      {value === null ? <em>NULL</em> : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="results-panel__empty">
          <p>Query executed successfully but returned no rows.</p>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
