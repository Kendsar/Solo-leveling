export interface AuthCredentials {
    email: string;
    password: string;
}

export interface SignUpCredentials extends AuthCredentials {
    confirmPassword: string;
}

export interface AuthError {
    message: string;
}