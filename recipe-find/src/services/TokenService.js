import axiosInstance from "./Api";

const getLocalRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refreshToken;
  };
  
  const getLocalAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.accessToken;
  };
  
  const updateLocalAccessToken = (token) => {
    let user = JSON.parse(localStorage.getItem("user"));
    user.accessToken = token;
    localStorage.setItem("user", JSON.stringify(user));
  };
  
  const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
  };
  
  const setUser = (user) => {
    console.log(JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
  };
  
  const removeUser = () => {
    localStorage.removeItem("user");
  };

  const refreshToken = async () => {
    try {
      const refreshToken = TokenService.getLocalRefreshToken();
  
      if (!refreshToken) {
        throw new Error("No refresh token available.");
      }
      const response = await axiosInstance.post("/auth/refresh-token", {
        refreshToken,
      });
  
      const { accessToken } = response.data;
      TokenService.updateLocalAccessToken(accessToken);
  
      return accessToken;
    } catch (error) {
      throw error;
    }
  };

  
  
  const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    getUser,
    setUser,
    removeUser,
    refreshToken
  };
  
  export default TokenService;