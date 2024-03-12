import { parseJwt } from "./AuthVerify";
import { logout } from "../slices/Auth";
import TokenService from "../services/TokenService";
import { refreshToken } from "../slices/Auth";
import axiosInstance from "../services/Api";

export const checkTokenExpiration = async (accessToken, dispatch) => {
  const decodedJwt = parseJwt(accessToken);
  const expirationTime = decodedJwt.exp * 1000;
  const currentTime = Date.now();

  // Check if the token is about to expire (e.g., 5 minutes before expiration)
  const tokenThreshold = 1 * 60 * 1000; // 5 minutes in milliseconds
  if (expirationTime - currentTime <= tokenThreshold) {
    try {
      const rs = await axiosInstance.post("/auth/refresh-token", {
        refreshToken: TokenService.getLocalRefreshToken(),
      });

      const { accessToken } = rs.data;

      dispatch(refreshToken(accessToken));
      TokenService.updateLocalAccessToken(accessToken);

      // Schedule the next token check (e.g., every 4 minutes)
      setTimeout(() => checkTokenExpiration(accessToken, dispatch), 1 * 60 * 1000); // 4 minutes in milliseconds
    } catch (error) {
      
      dispatch(logout());
    }
  } else {
    setTimeout(() => checkTokenExpiration(accessToken, dispatch), 1* 60 * 1000); // 4 minutes in milliseconds
  }
};