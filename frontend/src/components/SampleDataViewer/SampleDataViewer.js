import React from 'react';
import './SampleDataViewer.scss';

const SampleDataViewer = ({ tableSchemas }) => {
  if (!tableSchemas || tableSchemas.length === 0) {
    return null;
  }

  return (
    <div className="sample-data">
      <h3 className="sample-data__title">📊 Available Tables & Sample Data</h3>
      
      {tableSchemas.map((table, index) => (
        <div key={index} className="sample-data__table">
          <h4 className="sample-data__table-name">{table.tableName}</h4>
          
          <div className="sample-data__schema">
            <h5>Schema:</h5>
            <ul className="sample-data__columns">
              {table.columns.map((col, colIndex) => (
                <li key={colIndex} className="sample-data__column">
                  <strong>{col.name}</strong> ({col.type})
                  {col.description && (
                    <span className="sample-data__column-desc"> - {col.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {table.sampleData && table.sampleData.length > 0 && (
            <div className="sample-data__preview">
              <h5>Sample Data:</h5>
              <div className="sample-data__table-wrapper">
                <table className="sample-data__data-table">
                  <thead>
                    <tr>
                      {Object.keys(table.sampleData[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.sampleData.slice(0, 5).map((row, rowIndex) => (
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
              {table.sampleData.length > 5 && (
                <p className="sample-data__more">
                  ... and {table.sampleData.length - 5} more rows
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SampleDataViewer;
