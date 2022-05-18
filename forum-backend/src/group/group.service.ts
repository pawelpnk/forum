import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '../entity/group.entity';
import User from '../entity/user.entity';
import { UserService } from '../user/user.service';
import { Connection, Repository } from 'typeorm';
import { UpdateGroup } from './group.dto/update-group.dto';
import { NewGroup } from './group.dto/new-group.dto';

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
        newGroup.name = name.user + ', ' + user.login;
        newGroup.updateAt = new Date().toLocaleString();
        newGroup.users = [user, findUser];

        const createdGroup = await this.groupRepository.save(newGroup);

        return createdGroup;
    }

    async getGroups(user: User): Promise<Group[]> {

        const findGroups = await this.connection
            .getRepository(Group)
            .createQueryBuilder('group')
            .leftJoin('group.users', 'user')
            .where('user.id = :userId', {
                userId: user.id
            })
            .orderBy('group.updateAt', 'DESC')
            .getMany();

        return findGroups;
    }

    async updateTime(body: UpdateGroup): Promise<void> {
        await this.groupRepository.update(body.id, {
            updateAt: new Date().toLocaleString()
        })
    }
}
