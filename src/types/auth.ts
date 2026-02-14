export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
}

export interface LoginResponse extends User {
    token: string;
    refreshToken: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (data: LoginResponse) => void;
    updateToken: (token: string, refreshToken: string) => void;
    logout: () => void;
}
