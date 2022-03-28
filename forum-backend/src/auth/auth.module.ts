import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        forwardRef(()=> UserModule),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [
        AuthService
    ]
})
export class AuthModule {}
