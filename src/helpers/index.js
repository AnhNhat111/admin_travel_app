import axios from "../config/axiosConfig";
import { TOKEN_KEY } from "../constants/index";
import moment from "moment";
import { Redirect } from "react-router-dom";

export const validToken = async () => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    try {
      const data = await axios.get("/api/auth/valid-token");
      return true;
    } catch (err) {
      sessionStorage.removeItem(TOKEN_KEY);
      return false;
    }
  }
  return false;
};

export const formatDate = (val) => {
  if (val) {
    return moment(val);
  }
  return null;
};
