import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

export interface JwtPayload {
    id: string;
}

function cookieExtractor(req: any): null | string {
    return (req && req.cookies) ? (req.cookies?.jwt ?? null): null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService
    ){
        super({
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.SECRET_KEY
        })
    }

    async validate(payload: JwtPayload, done: (error, user) => void) {
        if(!payload || !payload.id) {
            return done(new UnauthorizedException(), false);
        }

        const user = await this.userService.findUserWithToken(payload.id)
        if(!user) {
            return done(new UnauthorizedException(), false);
        }

        done(null, user);
    }
}