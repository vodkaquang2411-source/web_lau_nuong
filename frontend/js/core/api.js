/**
 * LẨU RESTAURANT - FRONTEND API CLIENT SERVICE
 * Cung cấp các hàm gọi RESTful API từ giao diện người dùng đến Express Backend
 * Hỗ trợ tự động chuyển đổi sang Local State nếu Backend tạm thời chưa khởi động.
 */

const API_BASE_URL = window.location.origin.includes(':5000') 
  ? '/api' 
  : 'http://localhost:5000/api';

const ApiService = {
  // Lấy Auth Token từ LocalStorage
  getAuthHeader() {
    const user = window.AppState ? window.AppState.getCurrentUser() : null;
    return user && user.token ? { 'Authorization': `Bearer ${user.token}` } : {};
  },

  // GET Request
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        }
      });
      return await response.json();
    } catch (error) {
      console.warn(`[API GET Warning] Không thể kết nối tới backend (${endpoint}):`, error.message);
      return null;
    }
  },

  // POST Request
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.warn(`[API POST Warning] Không thể kết nối tới backend (${endpoint}):`, error.message);
      return null;
    }
  },

  // PUT Request
  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.warn(`[API PUT Warning] Không thể kết nối tới backend (${endpoint}):`, error.message);
      return null;
    }
  },

  // DELETE Request
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        }
      });
      return await response.json();
    } catch (error) {
      console.warn(`[API DELETE Warning] Không thể kết nối tới backend (${endpoint}):`, error.message);
      return null;
    }
  }
};

window.ApiService = ApiService;

