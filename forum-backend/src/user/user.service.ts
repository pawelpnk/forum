import { forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import NewUser from 'src/dto/new-user.dto';
import UserLogin from 'src/dto/user-login.dto';
import UserUpdateForUser from 'src/dto/user-update-for-user.dto';
import UserUpdateForAdmin from 'src/dto/user-update.dto';
import { OptionalUser } from 'src/entity/optionalUser.entity';
import User from 'src/entity/user.entity';
import UserResponse from 'src/interface/user-response.interface';
import { UserRole } from 'src/interface/user-role.interface';
import { PostService } from 'src/post/post.service';
import { TopicService } from 'src/topic/topic.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(OptionalUser) private optionalUserRepository: Repository<OptionalUser>,
        @Inject(forwardRef(()=> AuthService)) private authService: AuthService,
        @Inject(forwardRef(()=> PostService)) private postService: PostService,
        @Inject(forwardRef(()=> TopicService)) private topicService: TopicService
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
        createNewUser.image = '';
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
                'optionalUser'
            ]
        });

        if(!findUser) throw new HttpException('Zły login lub hasło', HttpStatus.NOT_FOUND);

        const checkIsNotBaned: boolean = findUser.active ? true : false;

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
            relations: ["optionalUser"],
            where: {
                login: user.login
            }
        })

        if(user.active === false && user.dateFinish) {
            updatedUser.optionalUser.dateFinish = user.dateFinish;
            updatedUser.optionalUser.message = user.reasonBan;
            await this.userRepository.save(updatedUser);
        }        

        return this.filter(updatedUser);
    }

    async updateUser(user: UserUpdateForUser): Promise<UserResponse> {
        let changePassword = false;
        let changeImage = false;
        const checkChangePassword: boolean = user.newPassword.length > 0 && user.oldPassword.length > 0 ? changePassword = true : false;
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
                throw new HttpException("Niepoprawne hasło", HttpStatus.UNAUTHORIZED)
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

        return this.filter(fetchUserUpdate);        
    }

    async deleteUser(login: string): Promise<any> {
        await this.userRepository.findOneOrFail(login);        
        
        return await this.userRepository.delete(login);
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

