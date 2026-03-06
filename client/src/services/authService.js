import api from "./api";
import useAuthStore from "@/store/useAuthStore";

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);

  if (response.data.success) {
    const { token, data: user } = response.data;
    useAuthStore.getState().setAuth(user, token);
  }
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post("/auth/login", userData);
  if (response.data.success) {
    const { token, data: user } = response.data;
    useAuthStore.getState().setAuth(user, token);
  }
  return response.data;
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
  } finally {
    useAuthStore.getState().clearAuth();
    window.location.href = "/login";
  }
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
};

export const getCurrentUser = () => useAuthStore.getState().user;

export const isAuthenticated = () => !!useAuthStore.getState().token;

const authService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  isAuthenticated,
};

export default authService;
