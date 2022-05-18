import { OptionalUser } from "../../entity/optionalUser.entity";

export default interface UserResponse {
    id: string;
    login: string;
    role: string;
    active: boolean;
    createAt?: Date;
    email?: string;
    optionalUser?: OptionalUser;
}