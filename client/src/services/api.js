const API_URL = 'http://localhost:3000';  // Set this to your backend API base URL

// Function to handle API responses
const handleResponse = async (response) => {
  // Check if response has content
  const contentType = response.headers.get('content-type');
  const hasJson = contentType && contentType.includes('application/json');
  
  if (!response.ok) {
    const errorText = await response.text();
    try {
      // Try to parse error response as JSON if possible
      const errorData = hasJson ? JSON.parse(errorText) : { message: errorText || response.statusText };
      return Promise.reject(errorData);
    } catch (e) {
      return Promise.reject({ message: errorText || response.statusText });
    }
  }
  
  // Return empty object for 204 No Content responses
  if (response.status === 204) {
    return {};
  }
  
  // Parse JSON only if content-type indicates JSON
  return hasJson ? response.json() : response.text();
};

// Auth services
export const authService = {
    signup: async (userData) => {
      try {
        const response = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
  
        // Handle empty responses
        if (response.status === 204) {
          return { message: 'Success' };
        }
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
  
        return data;
      } catch (error) {
        console.error('Signup error:', error);
        throw error;
      }
    },
    // ... rest of your authService
  };

// Notes services
export const notesService = {
  getNotes: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const response = await fetch(`${API_URL}/notes?${queryParams.toString()}`);
    return handleResponse(response);
  },
  
  uploadNotes: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/notes/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type - let the browser set it with boundary
      },
      body: formData
    });
    return handleResponse(response);
  },
  
  upvoteNote: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/notes/${id}/upvote`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }
};

// PYQs services
export const pyqsService = {
  getPyqs: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const response = await fetch(`${API_URL}/pyqs?${queryParams.toString()}`);
    return handleResponse(response);
  },
  
  uploadPyqs: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/pyqs/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type - let the browser set it with boundary
      },
      body: formData
    });
    return handleResponse(response);
  },
  
  upvotePyq: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/pyqs/${id}/upvote`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }
};