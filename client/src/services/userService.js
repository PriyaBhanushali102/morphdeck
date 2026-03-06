import api from "./api";

export const getUserProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.patch("/users/me", userData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.patch("/users/changepassword", passwordData);
  return response.data;
};

export const deleteUser = async () => {
  const response = await api.delete("/users/me");
  return response.data;
};

const userService = {
  getUserProfile,
  updateProfile,
  changePassword,
  deleteUser,
};

export default userService;
