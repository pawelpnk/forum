export default interface UserFilter {
    id: string;
    login: string;
    password: string;
    email: string;
    role: string;
    active: boolean;
    createAt?: Date;
    image?: string;
}