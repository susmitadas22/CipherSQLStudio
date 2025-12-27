const { pgPool } = require('../config/database');

const DANGEROUS_KEYWORDS = [
  'DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 
  'INSERT', 'UPDATE', 'GRANT', 'REVOKE', 'EXEC'
];

const sanitizeQuery = (query) => {
  const upperQuery = query.toUpperCase().trim();
  
  // Check for dangerous keywords
  for (const keyword of DANGEROUS_KEYWORDS) {
    if (upperQuery.includes(keyword)) {
      throw new Error(`Query contains forbidden keyword: ${keyword}`);
    }
  }
  
  // Ensure query starts with SELECT
  if (!upperQuery.startsWith('SELECT')) {
    throw new Error('Only SELECT queries are allowed');
  }
  
  // Check for multiple statements (semicolon)
  const statements = query.split(';').filter(s => s.trim());
  if (statements.length > 1) {
    throw new Error('Multiple SQL statements are not allowed');
  }
  
  return query;
};

const executeQuery = async (sqlQuery) => {
  const startTime = Date.now();
  
  try {
    // Sanitize the query
    const sanitizedQuery = sanitizeQuery(sqlQuery);
    
    // Execute with a timeout
    const client = await pgPool.connect();
    
    try {
      // Set a statement timeout (5 seconds)
      await client.query('SET statement_timeout = 5000');
      
      const result = await client.query(sanitizedQuery);
      const executionTime = Date.now() - startTime;
      
      return {
        success: true,
        rows: result.rows,
        rowCount: result.rowCount,
        fields: result.fields.map(f => ({
          name: f.name,
          dataType: f.dataTypeID,
        })),
        executionTime,
      };
    } finally {
      client.release();
    }
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    return {
      success: false,
      error: error.message,
      executionTime,
    };
  }
};

module.exports = {
  executeQuery,
  sanitizeQuery,
};
