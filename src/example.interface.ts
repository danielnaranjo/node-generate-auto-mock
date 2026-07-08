export interface UserAccount {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    role: 'admin' | 'user' | 'guest';
    lastLogin: string;
}
