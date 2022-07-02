import axios from "../config/axiosConfig";
import { TOKEN_KEY } from "../constants/index";

export const validToken = () => {
  const token = sessionStorage.getItem(TOKEN_KEY);

  if (token) {
    axios
      .get("/api/check-valid-token")
      .then((req) => {
        return true;
      })
      .catch((err) => {
        sessionStorage.removeItem(TOKEN_KEY);
        return false;
      });
  }

  return false;
};
