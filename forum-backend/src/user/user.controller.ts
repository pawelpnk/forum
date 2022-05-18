import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserObj } from '../decorators/user.decorator';
import NewUser from '../user/user.dto/new-user.dto';
import UserLogin from '../user/user.dto/user-login.dto';
import UserUpdateForUser from '../user/user.dto/user-update-for-user.dto';
import UserUpdateForAdmin from '../user/user.dto/user-update.dto';
import User from '../entity/user.entity';
import RoleGuard from '../guard/roles.guards';
import UserResponse from '../user/user.interface/user-response.interface';
import { UserRole } from '../user/user.interface/user-role.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/register')
    async addNewUser(
        @Res() res: Response,
        @Body() newUser: NewUser
    ) {
        try {
            const addedNewUser: UserResponse = await this.userService.createUser(newUser);
            return res.status(HttpStatus.OK).json({
                        message: 'Użytkownik dodany',
                        addedNewUser
                    });
        } catch (err) {
            return res.json({
                message: err.message
            });
        }
    }

    @Post('/login')
    async login(
        @Res() res: Response,
        @Body() userLogin: UserLogin
    ) {
        try {
            const loginAccount: any = await this.userService.login(userLogin);
            res.cookie('jwt', loginAccount.signToken.accessToken, {
                secure: false,
                domain: 'localhost',
                httpOnly: true
            })
            return res.status(HttpStatus.OK).json({
                message: "Zalogowano pomyślnie",
                user: loginAccount.filterUser
            })
        } catch (err) {
            res.json({
                message: err.message
            })
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logout(
        @UserObj() user: User,
        @Res() res: Response
    ) {
        return await this.userService.logout(user, res);
    }

    @Get('/all/:login')
    async findUser(
        @Res() res: Response,
        @Param('login') login: string
    ) {
        try {
            const searchUser: UserResponse = await this.userService.findUser(login);
            return res.status(HttpStatus.OK).json({
                searchUser
            })
        } catch {
            return res.json({
                message: 'Brak użytkownika'
            })
        }       
    }

    @UseGuards(RoleGuard(UserRole.ADMIN))
    @UseGuards(JwtAuthGuard)
    @Get('/all')
    async findAllUsers(
        @Res() res: Response
    ) {
        const allUsers: UserResponse[] = await this.userService.findAllUsers();
        return res.status(HttpStatus.OK).json(allUsers);
    }

    @UseGuards(RoleGuard(UserRole.ADMIN))
    @UseGuards(JwtAuthGuard)
    @Patch('/admin-update')
    async updateUserforAdmin (
        @Res() res: Response,
        @Body() user: UserUpdateForAdmin,
    ) {
        try {
            const updateUser: UserResponse = await this.userService.updateUserForAdmin(user);
            return res.status(HttpStatus.OK).json({
                message: "Pomyślnie zaaktualizowano użytkownika",
                updateUser
            })
        } catch {
            return res.json({
                message: "Nie udało się zaaktualizować użytkownika"
            })
        }       
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/user-update')
    async updateUserForUser (
        @Res() res: Response,
        @Body() user: UserUpdateForUser,
    ) {
        try {
            const updatedUser: UserResponse = await this.userService.updateUser(user);
            return res.status(HttpStatus.OK).json({
                message: 'Pomyślnie zaaktualizowano użytkownika',
                updatedUser
            });
        } catch (err) {
            return res.json({
                message: err
            });
        }
        
    }

    @UseGuards(RoleGuard(UserRole.ADMIN))
    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    async deleteUser(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        try {
            await this.userService.deleteUser(id);
            return res.status(HttpStatus.OK).json({
                message: 'Konto zostało usunięte'
            })
        } catch {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'Wystąpił błąd'
            })
        }        
    }
}
