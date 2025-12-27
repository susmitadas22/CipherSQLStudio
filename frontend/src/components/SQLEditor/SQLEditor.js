import React from 'react';
import Editor from '@monaco-editor/react';
import './SQLEditor.scss';

const SQLEditor = ({ value, onChange, readOnly = false }) => {
  const handleEditorChange = (newValue) => {
    onChange(newValue || '');
  };

  return (
    <div className="sql-editor">
      <div className="sql-editor__header">
        <span className="sql-editor__title">SQL Query Editor</span>
        <span className="sql-editor__hint">Write your SELECT query here</span>
      </div>
      <div className="sql-editor__container">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={value}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            readOnly: readOnly,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
};

export default SQLEditor;
