import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from 'src/entity/topic.entity';
import { PostService } from 'src/post/post.service';
import { SectionService } from 'src/section/section.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import NewTopic from './topic.dto/new-topic.dto';
import TopicResponse from './topic.interface/topic-response.interface';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic) private topicRepository: Repository<Topic>,
        @Inject(forwardRef(()=> UserService)) private userService: UserService,
        @Inject(forwardRef(() => SectionService)) private sectionService: SectionService,
        @Inject(forwardRef(()=> PostService)) private postService: PostService
    ) {}

    async createTopic(bodyTopic: NewTopic): Promise<any> {
        const findUser = await this.userService.findUserHelper(bodyTopic.userLogin);
        const findSection = await this.sectionService.findSection(bodyTopic.sectionId);

        const newTopic = new Topic();
        newTopic.topic = bodyTopic.topic;
        newTopic.createdAt = new Date().toLocaleString();
        newTopic.updatedAt = new Date().toLocaleString();
        newTopic.user = findUser;
        newTopic.section = findSection;
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

        const topicResponse = {
            id: newTopic.id,
            topic: newTopic.topic,
            createdAT: newTopic.createdAt,
            authorLogin: newTopic.user.login,
            sectionName: newTopic.section.sectionName,
            idPost: firstPost.id
        }
        return topicResponse;
    }

    async fetchOneTopic(id: string): Promise<Topic> {
        return await this.topicRepository.findOneOrFail(id);
    }

    async fetchAllTopics(id: string): Promise<any> {
        const findTopics = await this.topicRepository.find({
           where: { sectionId: id }
        });
        return findTopics;
    }

    async deleteTopic(id: string): Promise<any> {
        return await this.topicRepository.delete(id);
    }

    async updateTopic(data): Promise<any> {
        return await this.topicRepository.save(data);
    }
}
