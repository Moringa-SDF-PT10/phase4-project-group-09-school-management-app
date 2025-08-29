import axios from "axios";
import { toast } from 'react-toastify';

console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const { response } = error;
    
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: response?.status,
      data: response?.data
    });

    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          if (!window.location.pathname.includes('/login')) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            toast.error("Session expired. Please log in again.");
            window.location.href = "/login";
          }
          break;
          
        case 403:
          toast.error(data?.message || "You don't have permission to perform this action.");
          break;
          
        case 404:
          // Don't show toast for 404 errors to avoid spam
          console.warn("Resource not found:", error.config.url);
          break;
          
        case 422:
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat();
            errorMessages.forEach(msg => toast.error(msg));
          } else {
            toast.error(data.message || "Validation failed. Please check your input.");
          }
          break;
          
        case 429:
          toast.error("Too many requests. Please try again later.");
          break;
          
        case 500:
          toast.error("Server error. Please try again later.");
          break;
          
        default:
          if (data?.message) {
            toast.error(data.message);
          }
      }
    } else if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Please check your connection and try again.");
    } else if (error.code === "NETWORK_ERROR" || !error.response) {
      toast.error("Network error. Please check your internet connection.");
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  async request(config) {
    try {
      const response = await api(config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async get(url, config = {}) {
    return this.request({ method: "get", url, ...config });
  },

  async post(url, data = {}, config = {}) {
    return this.request({ method: "post", url, data, ...config });
  },

  async put(url, data = {}, config = {}) {
    return this.request({ method: "put", url, data, ...config });
  },

  async patch(url, data = {}, config = {}) {
    return this.request({ method: "patch", url, data, ...config });
  },

  async delete(url, config = {}) {
    return this.request({ method: "delete", url, ...config });
  },

  async upload(url, formData, onUploadProgress = null) {
    return this.request({
      method: "post",
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
      timeout: 30000, 
    });
  },

  async download(url, filename, config = {}) {
    try {
      const response = await api({
        method: "get",
        url,
        responseType: "blob",
        ...config,
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      return {
        status,
        message: data?.message || `Server error: ${status}`,
        errors: data?.errors,
        data: data,
        originalError: error,
      };
    } else if (error.request) {
      return {
        status: null,
        message: "Network error. Please check your connection.",
        originalError: error,
      };
    } else {
      return {
        status: null,
        message: error.message || "An unexpected error occurred.",
        originalError: error,
      };
    }
  },

  auth: {
    async login(credentials) {
      return apiService.post("/auth/login", credentials);
    },

    async register(userData) {
      return apiService.post("/auth/register", userData);
    },

    async logout() {
      return apiService.post("/auth/logout");
    },

    async refreshToken() {
      return apiService.post("/auth/refresh");
    },

    async getProfile() {
      return apiService.get("/auth/profile");
    },

    async updateProfile(userData) {
      return apiService.put("/auth/profile", userData);
    },

    async changePassword(passwordData) {
      return apiService.post("/auth/change-password", passwordData);
    },
  },

  users: {
    async getAll(params = {}) {
      return apiService.get("/users", { params });
    },

    async getById(id) {
      return apiService.get(`/users/${id}`);
    },

    async create(userData) {
      return apiService.post("/users", userData);
    },

    async update(id, userData) {
      return apiService.put(`/users/${id}`, userData);
    },

    async delete(id) {
      return apiService.delete(`/users/${id}`);
    },

    async search(query) {
      return apiService.get("/users/search", { params: { q: query } });
    },
  },

  classes: {
    async getAll(params = {}) {
      return apiService.get("/classes", { params });
    },

    async getById(id) {
      return apiService.get(`/classes/${id}`);
    },

    async create(classData) {
      return apiService.post("/classes", classData);
    },

    async update(id, classData) {
      return apiService.put(`/classes/${id}`, classData);
    },

    async delete(id) {
      return apiService.delete(`/classes/${id}`);
    },

    async getStudents(classId) {
      return apiService.get(`/classes/${classId}/students`);
    },

    async enrollStudent(classId, studentData) {
      return apiService.post(`/classes/${classId}/enroll`, studentData);
    },

    async unenrollStudent(classId, studentId) {
      return apiService.delete(`/classes/${classId}/students/${studentId}`);
    },

    async getSchedule(classId) {
      return apiService.get(`/classes/${classId}/schedule`);
    },
  },

  grades: {
    async getAll(params = {}) {
      return apiService.get("/grades", { params });
    },

    async getById(id) {
      return apiService.get(`/grades/${id}`);
    },

    async create(gradeData) {
      return apiService.post("/grades", gradeData);
    },

    async update(id, gradeData) {
      return apiService.put(`/grades/${id}`, gradeData);
    },

    async delete(id) {
      return apiService.delete(`/grades/${id}`);
    },

    async getStudentGrades(studentId) {
      return apiService.get(`/students/${studentId}/grades`);
    },

    async getClassGrades(classId) {
      return apiService.get(`/classes/${classId}/grades`);
    },

    async bulkUpdate(gradesData) {
      return apiService.post("/grades/bulk", gradesData);
    },
  },

  enrollments: {
    async getAll(params = {}) {
      return apiService.get("/enrollments", { params });
    },

    async getById(id) {
      return apiService.get(`/enrollments/${id}`);
    },

    async create(enrollmentData) {
      return apiService.post("/enrollments", enrollmentData);
    },

    async update(id, enrollmentData) {
      return apiService.put(`/enrollments/${id}`, enrollmentData);
    },

    async delete(id) {
      return apiService.delete(`/enrollments/${id}`);
    },

    async getStudentEnrollments(studentId) {
      return apiService.get(`/students/${studentId}/enrollments`);
    },
  },

  students: {
    async getAll(params = {}) {
      return apiService.get("/students", { params });
    },

    async getById(id) {
      return apiService.get(`/students/${id}`);
    },

    async create(studentData) {
      return apiService.post("/students", studentData);
    },

    async update(id, studentData) {
      return apiService.put(`/students/${id}`, studentData);
    },

    async delete(id) {
      return apiService.delete(`/students/${id}`);
    },

    async search(query) {
      return apiService.get("/students/search", { params: { q: query } });
    },
  },

  stats: {
    async getDashboard() {
      return apiService.get("/stats/dashboard");
    },

    async getClassStats(classId) {
      return apiService.get(`/stats/classes/${classId}`);
    },

    async getStudentStats(studentId) {
      return apiService.get(`/stats/students/${studentId}`);
    },

    async getGradeDistribution(classId) {
      return apiService.get(`/stats/classes/${classId}/grade-distribution`);
    },
  },
};

export const apiStatus = {
  isSuccess(status) {
    return status >= 200 && status < 300;
  },

  isClientError(status) {
    return status >= 400 && status < 500;
  },

  isServerError(status) {
    return status >= 500 && status < 600;
  },

  isError(status) {
    return status >= 400;
  },
};

export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

export { api as axiosInstance };

export default apiService;