import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5050/api/admin",
});

export const getAdmin = async (endpoint: string) => {
  const res = await API.get(`/${endpoint}`);
  return res.data;
};

export const postAdmin = async (
  endpoint: string,
  data: any
) => {
  const res = await API.post(`/${endpoint}`, data);
  return res.data;
};