import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        forwardRef(()=> UserModule),
    ],
    providers: [
        AuthService, 
        JwtStrategy,
        AuthController
    ],
    controllers: [AuthController],
    exports: [
        AuthService,
        JwtStrategy
    ]
})
export class AuthModule {}
