export interface AuthCredentials {
    email: string;
    password: string;
}

export interface SignUpCredentials extends AuthCredentials {
    username: string;
    confirmPassword: string;
}

export interface AuthError {
    message: string;
}