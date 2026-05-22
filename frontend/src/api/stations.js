// src/api/stations.js

import axios from "axios";

const API = "http://localhost:5000/api";

// CREATE axios instance (important)
const api = axios.create({
  baseURL: API,
  withCredentials: true, // THIS allows to send session data (cookies) with every request to check if user is logged in as admin
});

// GET ALL
export const getStations = async () => {
  const res = await api.get("/stations");
  return res.data;
};

// CREATE
export const createStation = async (data) => {
  const res = await api.post("/stations", data);
  return res.data;
};

// UPDATE
export const updateStation = async (id, data) => {
  const res = await api.put(`/stations/${id}`, data);
  return res.data;
};

// DELETE
export const deleteStation = async (id) => {
  const res = await api.delete(`/stations/${id}`);
  return res.data;
};

// TOGGLE STATUS
export const toggleStationStatus = async (id) => {
  const res = await api.patch(`/stations/${id}/deactivate`);
  return res.data;
};