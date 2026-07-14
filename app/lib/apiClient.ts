const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  //   async get(endpoint: string, options: RequestInit = {}) {
  //     return this.request(endpoint, { ...options, method: "GET" });
  //   }

  //   async post(endpoint: string, options: RequestInit = {}) {
  //     return this.request(endpoint, { ...options, method: "POST" });
  //   }

  //   async put(endpoint: string, options: RequestInit = {}) {
  //     return this.request(endpoint, { ...options, method: "PUT" });
  //   }

  //   async delete(endpoint: string, options: RequestInit = {}) {
  //     return this.request(endpoint, { ...options, method: "DELETE" });
  //  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Include cookies for authentication
      ...options,
    };

    const response = await fetch(url, config);

    //handle 401 (unauthorized) response
    if (response.status === 401) {
      //   // Redirect to login page or handle unauthorized access
      //   window.location.href = "/login";

      return null; // Return null or handle the unauthorized response as needed
    }

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(errorData.error || "API request failed");
    }

    return response.json();
  }

  //Auth methods

  async register(userData: string) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/api/auth/logout", {
      method: "POST",
    });
  }

  async getCurrentuser() {
    return this.request("/api/auth/me");
  }

  // User Methods

  async getUser() {
    return this.request("/api/user");
  }

  //Admin Methods

  async updateUserRole(userId: string, role: string) {
    return this.request(`/api/user/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  }

  async assignUserTeam(userId: string, teamId: string) {
    return this.request(`/api/user/${userId}/team`, {
      method: "PATCH",
      body: JSON.stringify({ teamId }),
    });
  }
}
