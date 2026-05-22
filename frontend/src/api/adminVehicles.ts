import axios from "axios";

const API = "http://localhost:5000/api/admin/vehicles";

const config = {
  withCredentials: true,
};

export const getVehicles = async () => {
  const res = await axios.get(API, config);
  return res.data;
};

export const createVehicle = async (data: any) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  const res = await axios.post(
    "http://localhost:5000/api/admin/vehicles",
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data;
};

export const updateVehicle = async (id: string, data: any) => {
  const res = await axios.put(`${API}/${id}`, data, config);
  return res.data;
};

export const deleteVehicle = async (id: string) => {
  const res = await axios.delete(`${API}/${id}`, config);
  return res.data;
};