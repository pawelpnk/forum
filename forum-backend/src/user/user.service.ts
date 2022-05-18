import { forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import NewUser from '../user/user.dto/new-user.dto';
import UserLogin from '../user/user.dto/user-login.dto';
import UserUpdateForUser from '../user/user.dto/user-update-for-user.dto';
import UserUpdateForAdmin from '../user/user.dto/user-update.dto';
import { OptionalUser } from '../entity/optionalUser.entity';
import User from '../entity/user.entity';
import UserResponse from '../user/user.interface/user-response.interface';
import { UserRole } from '../user/user.interface/user-role.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(OptionalUser) private optionalUserRepository: Repository<OptionalUser>,
        @Inject(forwardRef(()=> AuthService)) private authService: AuthService,
        ) {}

    filter = (user: User): UserResponse => {
        const { password, token, email, ...other } = user;
        return other;
    }

    async createUser(newUser: NewUser): Promise<UserResponse> {

        const isUserExist = await this.userRepository.findOne({
            where: [
                {login: newUser.login},
                {email: newUser.email}
            ]
        });

        if(isUserExist) {
            throw new HttpException('Użytkownik już istnieje, zmień login lub email', HttpStatus.CONFLICT)
        }

        if(!newUser.login || !newUser.password || !newUser.email) {
            throw new HttpException("Brak podstawowych danych", HttpStatus.BAD_REQUEST)
        }

        const createOptionalUser: OptionalUser = new OptionalUser();
        createOptionalUser.message = '';
        createOptionalUser.dateFinish = '';

        const additionalSettings = await this.optionalUserRepository.save(createOptionalUser);

        const hashPassword: string = await this.authService.hashPassword(newUser.password);

        const createNewUser: User = new User();
        createNewUser.login = newUser.login;
        createNewUser.password = hashPassword;
        createNewUser.email = newUser.email.toLowerCase();
        createNewUser.role = UserRole.USER;
        createNewUser.active = true;
        createNewUser.createdAt = new Date().toLocaleString();
        createNewUser.optionalUser = additionalSettings;

        const addedUSer = await this.userRepository.save(createNewUser);

        return this.filter(addedUSer);
    }

    async login(user: UserLogin): Promise<any> {
        const findUser = await this.userRepository.findOne({
            where: {
                login: user.login
            },
            relations: [
                'optionalUser',
            ]
        });

        if(!findUser) throw new HttpException('Zły login lub hasło', HttpStatus.NOT_FOUND);

        const checkIsNotBaned: boolean = Boolean(findUser.active);

        const comparePassword: boolean = await this.authService.comparePassword(user.password, findUser.password);
        
        if(!comparePassword) {
            throw new HttpException('Zły login lub hasło', HttpStatus.NOT_FOUND);
        }

        if(!checkIsNotBaned) {
            throw new HttpException(`Użytkownik zbanowany do ${findUser.optionalUser.dateFinish}`, HttpStatus.CONFLICT);
        }
        
        const pureToken = await this.authService.generateToken();
        findUser.token = pureToken;
        await this.userRepository.save(findUser);
        const signToken = await this.authService.createToken(pureToken);
        
        const filterUser = this.filter(findUser);

        const returnObject = {
            signToken,
            filterUser
        }

        return returnObject
    }

    async logout(user: User, res: Response): Promise<any> {
        try {
            user.token = null;
            await this.userRepository.save(user);
            res.clearCookie('jwt', {
                secure: false,
                domain: 'localhost',
                httpOnly: true
            });
            return res.json({ok: true})
        } catch (err) {
            return res.json({
                err: err.message
            })
        }
    }

    async findUser(login: string): Promise<UserResponse> {
        const findUser = await this.userRepository.findOneOrFail(login);
        
        return this.filter(findUser);
    }

    async findAllUsers(): Promise<UserResponse[]> {
        const allUsers = await this.userRepository.find({
            relations: ["optionalUser"]
        });
        allUsers.map(user => {
            delete user.password;
            delete user.token;
        });
        return allUsers;
    }

    async updateUserForAdmin(user: UserUpdateForAdmin): Promise<UserResponse> {
        const findUser = await this.userRepository.findOneOrFail({
            where: {
                id: user.id
            },
            relations: ["optionalUser"]
        });

        if(!user.active && user.dateFinish) {
            const banDate = new Date(user.dateFinish).toLocaleString();
            findUser.optionalUser.dateFinish = banDate;
            findUser.optionalUser.message = user.reasonBan;
            findUser.active = false; 
            findUser.token = null;       
        }

        if(user.role === 'admin' || user.role === 'user') {
            findUser.role = user.role;
        }

        await this.userRepository.save(findUser);               

        return this.filter(findUser);
    }

    async updateUser(user: UserUpdateForUser): Promise<UserResponse> {
        const checkChangePassword: boolean = user.newPassword?.length > 0 && user.oldPassword.length > 0;

        if(checkChangePassword){
            const checkUser = await this.userRepository.findOne({
                where: {
                    login: user.login
                }
            });
            const checkPassword: boolean = await this.authService.comparePassword(user.oldPassword, checkUser.password);
            if(checkPassword){
                const hashPassword: string = await this.authService.hashPassword(user.newPassword);
                await this.userRepository.update({login: user.login}, {
                    password: hashPassword
                });
            } else {
                throw new HttpException("Niepoprawne hasło", HttpStatus.UNAUTHORIZED)
            }
        }

        const fetchUserUpdate = await this.userRepository.findOne({
            where: {
                login: user.login
            }
        });

        return this.filter(fetchUserUpdate);        
    }

    async deleteUser(id: string): Promise<any> {
        await this.userRepository.findOneOrFail(id);        
        
        return await this.userRepository.delete(id);
    }

    /// helper functions

    async findUserHelper(login: string): Promise<User> {
        return await this.userRepository.findOneOrFail({login});        
    }
    async findUserHelperId(id: string): Promise<User> {
        return await this.userRepository.findOneOrFail({id});
    }

    async findUserWithToken(tokenId: string): Promise<User> {
        return await this.userRepository.findOne({token: tokenId})
    }

    async findAllBannedUsers(): Promise<User[]> {
        return await this.userRepository.find({
            relations: ["optionalUser"],
            where: {
                active: false
            }
        })
    }

    async updatedBannedUser(user: User): Promise<void> {
        const findUser = await this.userRepository.findOne({
            relations: ["optionalUser"],
            where: {
                id: user.id
            }
        });

        findUser.active = true;
        findUser.optionalUser.dateFinish = '';
        findUser.optionalUser.message = '';

        await this.userRepository.save(findUser);
    }
}

