import api from './api';

export const assignmentService = {
  // Get all assignments
  getAllAssignments: async () => {
    const response = await api.get('/assignments');
    return response.data;
  },

  // Get single assignment by ID
  getAssignment: async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },
};

export const queryService = {
  // Execute SQL query
  executeQuery: async (query, assignmentId = null) => {
    const response = await api.post('/query/execute', {
      query,
      assignmentId,
    });
    return response.data;
  },

  // Get hint from LLM
  getHint: async (assignmentId, userQuery = '') => {
    const response = await api.post('/query/hint', {
      assignmentId,
      userQuery,
    });
    return response.data;
  },
};

export const authService = {
  // Register new user
  signup: async (email, username, password) => {
    const response = await api.post('/auth/signup', {
      email,
      username,
      password,
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const attemptService = {
  // Get user's attempts
  getAttempts: async (assignmentId = null) => {
    const url = assignmentId 
      ? `/attempts?assignmentId=${assignmentId}`
      : '/attempts';
    const response = await api.get(url);
    return response.data;
  },
};
