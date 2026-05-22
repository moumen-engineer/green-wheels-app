import axios from "axios";

const API = "http://localhost:5000/api/admin/users";

const config = {
  withCredentials: true, // THIS IS THE KEY TO SEND THE COOKIE of the session to the backend
};

export const getUsers = async () => {
  const res = await axios.get(API, config);
  return res.data;
};

export const toggleUserStatus = async (id: string) => {
  const res = await axios.patch(`${API}/${id}/status`, {}, config);
  return res.data;
};

export const changeUserRole = async (id: string, role: string) => {
  const res = await axios.patch(`${API}/${id}/role`, { role }, config);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axios.delete(`${API}/${id}`, config);
  return res.data;
};