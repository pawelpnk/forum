import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/entity/group.entity';
import User from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Connection, Repository } from 'typeorm';
import { NewGroup } from './group.interface/new-group.interface';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group) private groupRepository: Repository<Group>,
        private connection: Connection,
        @Inject(forwardRef(() => UserService)) private userService: UserService
    ) {}

    async createGroup(user: User, name: NewGroup): Promise<Group> {

        const findUser = await this.userService.findUserHelper(name.user);

        if(!findUser) {
            throw new HttpException("Nie ma takiego użytkownika", HttpStatus.NOT_FOUND);
        }

        const newGroup: Group = new Group();
        newGroup.name = name.user;
        newGroup.updateAt = new Date().toLocaleString();
        newGroup.users = [user, findUser];

        const createdGroup = await this.groupRepository.save(newGroup);

        return createdGroup;
    }

    async getGroups(user: User): Promise<Group[]> {

        const findGroups = await this.connection
            .getRepository(Group)
            .createQueryBuilder('groups')
            .leftJoin('groups.users', 'users')
            .where('users.id = :id', {
                id: user.id
            })
            .getMany();

        return findGroups;
    }
}