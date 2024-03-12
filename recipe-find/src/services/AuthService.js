import api from "./Api";
import TokenService from "./TokenService";

const register = (firstName, lastName, email, phone, password) => {
  return api.post("/auth/sign-up", {
        firstName,
        lastName,
        email,
        phone,
        password
  });
};

const login = (email, password) => {
  return api
    .post("/auth/sign-in", {
      email,
      password
    })
    .then((response) => {
      if (response.data.accessToken) {
        TokenService.setUser(response.data);
      }

      return response.data;
    });
};

const logout = () => {
   api.post("/auth/sign-out")
    .then(() => {
      TokenService.removeUser();
    });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser
};

export default AuthService;