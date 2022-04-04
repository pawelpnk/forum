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

    async createTopic(bodyTopic: NewTopic): Promise<TopicResponse> {
        const findUser = await this.userService.findUserHelper(bodyTopic.userLogin);
        const findSection = await this.sectionService.findSection(bodyTopic.sectionId);

        const newTopic = new Topic();
        newTopic.topic = bodyTopic.topic;
        newTopic.createdAt = new Date().toLocaleString();
        newTopic.updatedAt = new Date().toLocaleString();
        newTopic.user = findUser;
        newTopic.section = findSection;
        newTopic.sectionId = findSection.id;
        newTopic.userId = findUser.id;

        await this.topicRepository.save(newTopic);

        const topicResponse: TopicResponse = {
            id: newTopic.id,
            topic: newTopic.topic,
            createdAT: newTopic.createdAt,
            authorLogin: newTopic.user.login,
            sectionName: newTopic.section.sectionName
        }
        return topicResponse;
    }

    async fetchOneTopic(id: string): Promise<Topic> {
        return await this.topicRepository.findOneOrFail(id);
    }

    async fetchAllTopics(id: string): Promise<Topic[]> {
        return await this.topicRepository.find({sectionId: id}) 
    }

    async deleteTopic(id: string): Promise<any> {
        return await this.topicRepository.delete(id);
    }
}
