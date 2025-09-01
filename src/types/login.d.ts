export interface LoginResponse {
    success: boolean;
    loginData?: Login;
    message?: string;
}

export interface AuthData {
  userDetails: Login | null;
  isAuthenticated: boolean;
  login: (data: Login | null) => void;
  logout: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

