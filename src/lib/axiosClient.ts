import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { getAuth } from "firebase/auth";
import { store } from "../store/store";
import { executeLogout } from "@/utils/logoutHelper";

interface CreateClientOptions {
  baseURL: string;
  timeout?: number;
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

const handleAuthError = () => {
  executeLogout(store.dispatch);
};

interface JwtPayload {
  exp: number;
  [key: string]: unknown;
}

const extractTokenPayload = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64)) as JwtPayload;
  } catch (error) {
    console.error("Token validation failed", error);
    return null;
  }
};

const createAxiosClient = ({ baseURL, timeout = 20000 }: CreateClientOptions): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL,
    timeout,
  });

  const refreshToken = async (): Promise<string> => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          if (user) {
            user
              .getIdToken(true)
              .then((token) => {
                localStorage.setItem("authToken", token);
                resolve(token);
              })
              .catch(() => {
                handleAuthError();
                reject(new AuthError("Token refresh failed"));
              });
          } else {
            reject(new AuthError("No authenticated user"));
          }
        });
      });
    }

    try {
      const freshToken = await currentUser.getIdToken(true);
      localStorage.setItem("authToken", freshToken);
      return freshToken;
    } catch {
      handleAuthError();
      throw new AuthError("Token refresh failed");
    }
  };

  const isTokenExpired = (token: string): boolean => {
    const payload = extractTokenPayload(token);
    return payload ? payload.exp * 1000 < Date.now() : true;
  };

  const validateToken = async (): Promise<string | null> => {
    const token = localStorage.getItem("authToken");
    if (!token || isTokenExpired(token)) {
      return await refreshToken();
    }
    return token;
  };

  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        const token = await validateToken();
        if (config.headers && typeof config.headers === "object") {
          (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
        }
        return config;
      } catch (error: unknown) {
        console.error("Token validation error", error);
        return Promise.reject(error);
      }
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ error: string }>) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      const is401 =
        error.response?.status === 401 ||
        error.response?.data?.error === "Unauthorized: Invalid token";

      if (is401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshToken();
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return axiosInstance(originalRequest);
        } catch {
          handleAuthError();
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const axiosClient = createAxiosClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "",
});
