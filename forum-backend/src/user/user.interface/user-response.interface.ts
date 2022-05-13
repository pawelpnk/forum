export default interface UserResponse {
    id: string;
    login: string;
    role: string;
    active: boolean;
    createAt?: Date;
    image?: string;
}