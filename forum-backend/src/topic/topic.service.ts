import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from '../entity/section.entity';
import { Topic } from '../entity/topic.entity';
import User from '../entity/user.entity';
import { PostService } from '../post/post.service';
import { SectionService } from '../section/section.service';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import NewTopic from './topic.dto/new-topic.dto';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic) private topicRepository: Repository<Topic>,
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        @Inject(forwardRef(() => SectionService)) private sectionService: SectionService,
        @Inject(forwardRef(() => PostService)) private postService: PostService
    ) {}

    async createTopic(bodyTopic: NewTopic): Promise<string> {
        const findUser: User = await this.userService.findUserHelper(bodyTopic.userLogin);
        const findSection: Section = await this.sectionService.findSection(bodyTopic.sectionId);

        const newTopic: Topic = new Topic();
        newTopic.topic = bodyTopic.topic;
        newTopic.createdAt = new Date().toLocaleString();
        newTopic.updatedAt = new Date().toLocaleString();
        newTopic.user = findUser;
        newTopic.section = findSection;
        newTopic.sectionName = findSection.sectionName;
        newTopic.sectionId = findSection.id;
        newTopic.userId = findUser.login;
        newTopic.countPostsTopic = 1;
        newTopic.lastPostUser = findUser.login;

        await this.topicRepository.save(newTopic);

        const postDTO = {
            firstPost: bodyTopic.firstPost,
            user: findUser,
            topic: newTopic,
            createdAt: newTopic.createdAt,
            updatedAt: newTopic.updatedAt
        }

        const firstPost = await this.postService.createPostWithTopic(postDTO);

        const topicResponse = newTopic.topic;
        
        return topicResponse;
    }

    async fetchOneTopic(id: string): Promise<Topic> {
        return await this.topicRepository.findOneOrFail(id);
    }

    async fetchAllTopics(id: string): Promise<Topic[]> {
        const findTopics = await this.topicRepository.find({
           where: { sectionId: id }
        });
        return findTopics;
    }

    async deleteTopic(id: string): Promise<any> {
        return await this.topicRepository.delete(id);
    }

    async updateTopic(data): Promise<Topic> {
        return await this.topicRepository.save(data);
    }
}
