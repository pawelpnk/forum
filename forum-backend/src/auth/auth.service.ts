import { Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {


    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    async comparePassword(newPassword: string, oldPassword: string): Promise<boolean> {
        return await bcrypt.compare(newPassword, oldPassword);
    }
}
