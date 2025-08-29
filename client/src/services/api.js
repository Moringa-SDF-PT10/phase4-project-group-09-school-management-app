import axios from "axios";
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          window.location.href = "/login";
          toast.error("Session expired. Please log in again.");
          break;
          
        case 403:
          toast.error("You don't have permission to perform this action.");
          break;
          
        case 404:
          toast.error("The requested resource was not found.");
          break;
          
        case 422:
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat();
            errorMessages.forEach(msg => toast.error(msg));
          } else {
            toast.error(data.message || "Validation failed.");
          }
          break;
          
        case 429:
          toast.error("Too many requests. Please try again later.");
          break;
          
        case 500:
          toast.error("Server error. Please try again later.");
          break;
          
        default:
          toast.error(data?.message || "An unexpected error occurred.");
      }
    } else if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Please check your connection and try again.");
    } else if (error.code === "NETWORK_ERROR") {
      toast.error("Network error. Please check your internet connection.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
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

  // GET request
  async get(url, config = {}) {
    return this.request({ method: "get", url, ...config });
  },

  // POST request
  async post(url, data = {}, config = {}) {
    return this.request({ method: "post", url, data, ...config });
  },

  // PUT request
  async put(url, data = {}, config = {}) {
    return this.request({ method: "put", url, data, ...config });
  },

  // PATCH request
  async patch(url, data = {}, config = {}) {
    return this.request({ method: "patch", url, data, ...config });
  },

  // DELETE request
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
        originalError: error,
      };
    } else if (error.request) {
      // Request was made but no response received
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
      return api.post("/auth/login", credentials);
    },

    async register(userData) {
      return api.post("/auth/register", userData);
    },

    async logout() {
      return api.post("/auth/logout");
    },

    async refreshToken() {
      return api.post("/auth/refresh");
    },

    async getProfile() {
      return api.get("/auth/profile");
    },
  },

  users: {
    async getAll(params = {}) {
      return api.get("/users", { params });
    },

    async getById(id) {
      return api.get(`/users/${id}`);
    },

    async create(userData) {
      return api.post("/users", userData);
    },

    async update(id, userData) {
      return api.put(`/users/${id}`, userData);
    },

    async delete(id) {
      return api.delete(`/users/${id}`);
    },
  },

  classes: {
    async getAll(params = {}) {
      return api.get("/classes", { params });
    },

    async getById(id) {
      return api.get(`/classes/${id}`);
    },

    async create(classData) {
      return api.post("/classes", classData);
    },

    async update(id, classData) {
      return api.put(`/classes/${id}`, classData);
    },

    async delete(id) {
      return api.delete(`/classes/${id}`);
    },

    async getStudents(classId) {
      return api.get(`/classes/${classId}/students`);
    },

    async enrollStudent(classId, studentData) {
      return api.post(`/classes/${classId}/enroll`, studentData);
    },
  },

  grades: {
    async getAll(params = {}) {
      return api.get("/grades", { params });
    },

    async getById(id) {
      return api.get(`/grades/${id}`);
    },

    async create(gradeData) {
      return api.post("/grades", gradeData);
    },

    async update(id, gradeData) {
      return api.put(`/grades/${id}`, gradeData);
    },

    async delete(id) {
      return api.delete(`/grades/${id}`);
    },

    async getStudentGrades(studentId) {
      return api.get(`/students/${studentId}/grades`);
    },

    async getClassGrades(classId) {
      return api.get(`/classes/${classId}/grades`);
    },
  },

  enrollments: {
    async getAll(params = {}) {
      return api.get("/enrollments", { params });
    },

    async getById(id) {
      return api.get(`/enrollments/${id}`);
    },

    async update(id, enrollmentData) {
      return api.put(`/enrollments/${id}`, enrollmentData);
    },

    async delete(id) {
      return api.delete(`/enrollments/${id}`);
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

export { api as axiosInstance };

export default apiService;