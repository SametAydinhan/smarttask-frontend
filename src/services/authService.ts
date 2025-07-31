import axios  from "axios";

const API = "http://localhost:5000/api/auth";

export const login = async (data: {email:string; password:string}) => {
    const res = await axios.post(`${API}/login`, data);
    return res.data;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API}/register`, data);
  return res.data;
};