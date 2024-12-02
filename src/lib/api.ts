const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Error types
class NetworkError extends Error {
  constructor(message = 'Network error. Please check your connection') {
    super(message);
    this.name = 'NetworkError';
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Enhanced fetch with timeout and error handling
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new NetworkError('Request timed out. Please try again.');
      }
      if (!navigator.onLine) {
        throw new NetworkError('You appear to be offline. Please check your internet connection.');
      }
    }
    throw error;
  }
}

// Handle API response
async function handleResponse(response: Response) {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let message = `HTTP error! status: ${response.status}`;
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      message = data.message || message;
    }
    
    throw new ApiError(response.status, message);
  }

  return await response.json();
}

export async function registerUser(data: {
  username: string;
  walletAddress: string;
}) {
  try {
    const response = await fetchWithTimeout(`${API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    return result.user;
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error instanceof NetworkError) {
      toast.error(error.message);
    } else if (error instanceof ApiError) {
      toast.error(error.message);
    } else {
      toast.error('Failed to register. Please try again.');
    }
    throw error;
  }
}

export async function loginUser(walletAddress: string) {
  try {
    const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
    const result = await handleResponse(response);
    return result.user;
  } catch (error: any) {
    console.error('Login error:', error);
    if (error instanceof NetworkError) {
      toast.error(error.message);
    } else if (error instanceof ApiError && error.status === 404) {
      error.message = 'USER_NOT_FOUND';
      throw error;
    } else {
      toast.error('Failed to login. Please try again.');
    }
    throw error;
  }
}

export async function getUserProfile(username: string) {
  try {
    const response = await fetchWithTimeout(`${API_URL}/users/${username}`, {
      method: 'GET',
    });
    return await handleResponse(response);
  } catch (error: any) {
    console.error('Get profile error:', error);
    if (error instanceof NetworkError) {
      toast.error(error.message);
    } else {
      toast.error('Failed to load profile. Please try again.');
    }
    throw error;
  }
}