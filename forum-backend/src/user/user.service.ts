import { forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import NewUserInside from 'src/dto/new-user-inside.dto';
import NewUser from 'src/dto/new-user.dto';
import UserLogin from 'src/dto/user-login.dto';
import UserUpdateForUser from 'src/dto/user-update-for-user.dto';
import UserUpdateForAdmin from 'src/dto/user-update.dto';
import User from 'src/entity/user.entity';
import UserFilter from 'src/interface/user-filter.interface';
import UserResponse from 'src/interface/user-response.interface';
import { UserRole } from 'src/interface/user-role.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @Inject(forwardRef(()=> AuthService))private authService: AuthService
        ) {}

    filter = (user: UserFilter): UserResponse => {
        const { password, ...other } = user;
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
            throw new HttpException('User already exist', HttpStatus.CONFLICT)
        }

        const hashPassword: string = await this.authService.hashPassword(newUser.password);

        const createNewUser: User = new User();
        createNewUser.login = newUser.login;
        createNewUser.password = hashPassword;
        createNewUser.email = newUser.email.toLowerCase();
        createNewUser.role = UserRole.USER;
        createNewUser.active = true;
        createNewUser.image = '';

        const addedUSer = await this.userRepository.save(createNewUser);
        return this.filter(addedUSer);
    }

    async login(user: UserLogin): Promise<UserResponse> {
        const findUser = await this.userRepository.findOneOrFail({
            where: {
                login: user.login
            }
        });

        const checkIsNotBaned: boolean = findUser.active ? true : false;

        const comparePassword = await this.authService.comparePassword(user.password, findUser.password);
        
        if(!comparePassword) {
            throw new HttpException('Bad login or password', HttpStatus.NOT_FOUND);
        }

        if(!checkIsNotBaned) {
            throw new HttpException('User baned', HttpStatus.CONFLICT);
        }

        return this.filter(findUser);
    }

    async findUser(login: string): Promise<UserResponse> {
        const findUser = await this.userRepository.findOneOrFail(login);

        return this.filter(findUser);
    }

    async findAllUsers(): Promise<UserResponse[]> {
        const allUsers = await this.userRepository.find();
        const filterAllUsers = allUsers.map(user => this.filter(user));
        return filterAllUsers;
    }

    async updateUserForAdmin(user: UserUpdateForAdmin): Promise<UserResponse> {
        await this.userRepository.update({login: user.login}, {
            role: user.role,
            active: user.active,
            image: user.image
        });
        const updatedUser = await this.userRepository.findOne({
            where: {
                login: user.login
            }
        })
        return this.filter(updatedUser);
    }

    async updateUser(user: UserUpdateForUser): Promise<UserResponse> {
        let changePassword = false;
        let changeImage = false;
        const checkChangePassword: boolean = user.newPassword.length > 0 && user.newPassword.length > 0 ? changePassword = true : false;
        const checkChangeImage: boolean = user.image.length > 0 ? changeImage = true : false;

        if(changePassword){
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
                throw new HttpException("Bad password", HttpStatus.UNAUTHORIZED)
            }
        }
        if(changeImage){
            await this.userRepository.update({login: user.login}, {
                image: user.image
            });
        }

        const fetchUserUpdate = await this.userRepository.findOne({
            where: {
                login: user.login
            }
        });
        console.log(fetchUserUpdate);
        return this.filter(fetchUserUpdate);        
    }

    async deleteUser(login: string): Promise<any> {
        await this.userRepository.findOneOrFail(login);
        return await this.userRepository.delete(login);
    }

    /// helper functions

    async findUserHelper(login: string): Promise<User> {
        return await this.userRepository.findOneOrFail({login})
         
    }
}
