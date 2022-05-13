import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt.strategy';
const bcrypt = require('bcrypt');
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UserService)) private userService: UserService
    ) {}

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    async comparePassword(newPassword: string, oldPassword: string): Promise<boolean> {
        return await bcrypt.compare(newPassword, oldPassword);
    }

    async generateToken(): Promise<string> {
        let token;
        let userWithThisToken = null;
        do {
            token = uuid();
            userWithThisToken = await this.userService.findUserWithToken(token);
        } while (!!userWithThisToken);

        return token;
    }    

    async createToken(tokenId: string):  Promise<{accessToken: string, expiresIn: number}> {
        const payload: JwtPayload = { id: tokenId };
        const expiresIn = parseInt(process.env.EXPIRES_IN);
        const accessToken = sign(payload, process.env.SECRET_KEY, { expiresIn});

        return {
            accessToken,
            expiresIn
        }
    }
}
