export interface JwtPayload {
    sub: string; // user ID
    email: string;
    role: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}
