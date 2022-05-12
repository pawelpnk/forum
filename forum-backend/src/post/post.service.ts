import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';
import { TopicService } from 'src/topic/topic.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import NewPost from './post.dto/new-post.dto';
import { RateUpdatePost } from './post.dto/rate-update-post';
import UpdatePost from './post.dto/update-post.dto';
import PostResponse from './post.interface/post-response.interface';
import { Notification } from 'src/entity/notification.entity';
import { UserRole } from 'src/interface/user-role.interface';
import User from 'src/entity/user.entity';
import { SectionService } from 'src/section/section.service';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        @Inject(forwardRef(() => TopicService)) private topicService: TopicService
    ) {}

    async createPost(body: NewPost, user: User): Promise<PostResponse> {
        const findUser = await this.userService.findUserHelperId(body.idUser);
        const findTopic = await this.topicService.fetchOneTopic(body.topicId);

        const checkSignedUsers = body.text.match(/(?<=@)\w+/gi);
        if(checkSignedUsers && checkSignedUsers.length <= 10) {

            for(let i = 0; i < checkSignedUsers.length; i++) {
                const findUserForNoti = await this.userService.findUserHelper(checkSignedUsers[i]);

                const newNote: Notification = new Notification();
                newNote.message = `Zostałeś oznaczony przez ${findUser.login} w ${body.sectionName}/${findTopic.topic}`
                newNote.fromWho = findUser.login;
                newNote.toWho = checkSignedUsers[i];
                newNote.toDisplay = true;
                newNote.topicId = findTopic.id;
                newNote.createAt = new Date().toLocaleString();
                newNote.user = findUserForNoti;

                await this.notificationRepository.save(newNote);
            }
        }

        if(checkSignedUsers && checkSignedUsers.length > 10) {
            throw new HttpException("zbyt dużo oznaczonych osób", HttpStatus.TOO_MANY_REQUESTS);
        }

        const newPost: Post = new Post();

        newPost.text = body.text;
        newPost.createAt = new Date().toLocaleString();
        newPost.updateAt = new Date().toLocaleString();
        newPost.rating = 0;
        newPost.user = user;
        newPost.userId = user.login;
        newPost.topic = findTopic;
        newPost.topicId = findTopic.id;
        newPost.topicName = findTopic.topic;
        newPost.sectionName = body.sectionName;

        await this.postRepository.save(newPost);

        findTopic.updatedAt = newPost.updateAt;
        findTopic.countPostsTopic++;
        findTopic.lastPostUser = findUser.login;

        await this.topicService.updateTopic(findTopic);

        const PostResponse = {
            id: newPost.id,
            text: newPost.text,
            createAt: newPost.createAt,
            rating: newPost.rating,
            userId: newPost.userId,
            topicId: newPost.topicId
        }

        return PostResponse;        
    }

    async createPostWithTopic(body): Promise<any> {
        const newPost: Post = new Post();

        newPost.text = body.firstPost;
        newPost.createAt = body.createdAt
        newPost.updateAt = body.updatedAt;
        newPost.rating = 0;
        newPost.user = body.user;
        newPost.userId = body.user.login;
        newPost.topic = body.topic;
        newPost.topicId = body.topic.id;
        newPost.topicName = body.topic.topic;
        newPost.sectionName = body.topic.sectionName;

        await this.postRepository.save(newPost);
        
        const PostResponse = {
            id: newPost.id,
        }

        return PostResponse;
    }

    async fetchAllPosts(idTopic: string): Promise<Post[]> {
        return await this.postRepository.find({
            where: {
                topicId: idTopic
            }
        });
    }

    async fetchOnePost(idPost: string): Promise<Post> {
        return await this.postRepository.findOne({id: idPost})
    }

    async updatePost(id: string, updatePost: UpdatePost, user): Promise<Post> {

        if(user.role === UserRole.ADMIN) {
            await this.postRepository.update({id}, {
                text: updatePost.text,
                updateAt: new Date().toLocaleString()
            })
        } else {
            await this.postRepository.update({
                id,
                userId: user.id
            }, {
            text: updatePost.text,
            updateAt: new Date().toLocaleString()
        })
        }        

        const updatedPost = await this.fetchOnePost(id);

        if(!updatedPost) {
            throw new HttpException('Nie ma takiego postu', HttpStatus.BAD_REQUEST)
        }

        return updatedPost;
    }

    async changeRate(id: string, rateUpdatePost: RateUpdatePost): Promise<Post> {
        const findPost = await this.postRepository.findOneOrFail(id);
        const checkUserRated: boolean = findPost.userRated.some(user => user === rateUpdatePost.userLogin);

        if(checkUserRated) {
            throw new HttpException('Już zagłosowano', HttpStatus.FORBIDDEN);
        }
        if(rateUpdatePost.rate === 1){
            findPost.rating++;
        } else {
            findPost.rating--;
        }
        findPost.userRated.push(rateUpdatePost.userLogin);
        await this.postRepository.save(findPost);

        return findPost;
    }

    async deletePost(id: string): Promise<any> {
        const findPost = await this.postRepository.findOne(id);
        const findTopic = await this.topicService.fetchOneTopic(findPost.topicId);
        findTopic.countPostsTopic--;
        await this.topicService.updateTopic(findTopic);
        return await this.postRepository.delete(id);
    }
}
