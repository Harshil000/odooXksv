import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/reports",
  withCredentials: true,
});

export const fetchReportsData = async () => {
  const res = await api.get("/");
  return res.data;
};
