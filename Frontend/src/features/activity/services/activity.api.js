import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/activities",
  withCredentials: true,
});

export const fetchActivityLogs = async () => {
  const res = await api.get("/");
  return res.data;
};
