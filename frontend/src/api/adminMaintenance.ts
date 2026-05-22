import axios from "axios";

const API = "http://localhost:5000/api/admin/maintenance";

const config = {
  withCredentials: true,
};

// GET all maintenance
export const getMaintenance = async () => {
  const res = await axios.get(API, config);
  return res.data;
};

// CREATE maintenance
export const createMaintenance = async (data: any) => {
  const res = await axios.post(API, data, config);
  return res.data;
};

// DELETE maintenance
export const deleteMaintenance = async (id: string) => {
  const res = await axios.delete(`${API}/${id}`, config);
  return res.data;
};

export const updateMaintenanceStatus = async (id: string, status: string) => {
  const res = await axios.patch(
    `http://localhost:5000/api/admin/maintenance/${id}/status`,
    { status },
    { withCredentials: true }
  );
  return res.data;
};