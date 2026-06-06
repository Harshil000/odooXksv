import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:3000/api/admin",
  withCredentials: true,
});

export const fetchUsersList = async () => {
  const res = await adminApi.get("/users");
  return res.data;
};

export const updateUserStatus = async (userId, isActive) => {
  const res = await adminApi.put(`/users/${userId}/status`, {
    is_active: isActive,
  });
  return res.data;
};
