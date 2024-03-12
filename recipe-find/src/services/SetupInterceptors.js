import TokenService from "./TokenService";
import { refreshToken } from "../slices/Auth";
import axiosInstance from "./Api";


const SetupInterceptors = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        config.headers["Authorization"] = 'Bearer ' + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const { dispatch } = store;
  let isRefreshing = false;
  let refreshPromise = null;

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      if (originalConfig.url !== "/auth/signin" && err.response) {
        
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          if (!isRefreshing) {
            isRefreshing = true;

           
            const isPageRefresh = !TokenService.getLocalAccessToken();

            refreshPromise = axiosInstance.post("/auth/refresh-token", {
              refreshToken: TokenService.getLocalRefreshToken(),
            });

            try {
              const rs = await refreshPromise;
              const { accessToken } = rs.data;

              dispatch(refreshToken(accessToken));
              TokenService.updateLocalAccessToken(accessToken);

           
              if (isPageRefresh) {
              
                window.location.href = "/";
              }

              return axiosInstance(originalConfig);
            } catch (_error) {
      
              return Promise.reject(_error);
            } finally {
              isRefreshing = false;
            }
          } else {
      
            return refreshPromise.then(() => {
              return axiosInstance(originalConfig);
            });
          }
        }
      }

      return Promise.reject(err);
    }
  );
};

export default SetupInterceptors;