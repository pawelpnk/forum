import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';
import { TopicService } from 'src/topic/topic.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import NewPost from './post.dto/new-post.dto';
import UpdatePost from './post.dto/update-post.dto';
import PostResponse from './post.interface/post-response.interface';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @Inject(forwardRef(() => UserService))private userService: UserService,
        @Inject(forwardRef(()=>TopicService))private topicService: TopicService
    ) {}

    async createPost(body: NewPost): Promise<PostResponse> {
        const findUser = await this.userService.findUserHelperId(body.idUser);
        const findTopic = await this.topicService.fetchOneTopic(body.idTopic)

        const newPost: Post = new Post();

        newPost.text = body.text;
        newPost.createAt = new Date().toLocaleString();
        newPost.updateAt = new Date().toLocaleString();
        newPost.rating = 0;
        newPost.user = findUser;
        newPost.userId = findUser.id;
        newPost.topic = findTopic;
        newPost.topicId = findTopic.id;

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
        newPost.userId = body.user.id;
        newPost.topic = body.topic;
        newPost.topicId = body.topic.id;

        await this.postRepository.save(newPost);
        
        const PostResponse = {
            id: newPost.id,
        }

        return PostResponse;
    }

    async fetchAllPosts(idTopic: string): Promise<Post[]> {
        return await this.postRepository.find({topicId: idTopic});
    }

    async findLastPostAndCounts(id: string): Promise<any> {
        const amountPosts = await this.postRepository.count({
            topicId: id
        })
         const lastPost = await this.postRepository.findOne(id, {
            where: {
                topicId: id
            },
            // order: {createAt: 'DESC'}
        })
        const postToTopicResponse = {
            amountPosts,
            lastPost
        }
        return postToTopicResponse;
    }

    async fetchOnePost(idPost: string): Promise<Post> {
        return await this.postRepository.findOne({id: idPost})
    }

    async updatePost(updatePost: UpdatePost): Promise<Post> {

        await this.postRepository.update({id: updatePost.id}, {
            text: updatePost.text,
            rating: updatePost.rating,
            updateAt: new Date().toLocaleString()
        })

        const updatedPost = await this.fetchOnePost(updatePost.id);

        if(!updatedPost) {
            throw new HttpException('Nie ma takiego postu', HttpStatus.BAD_REQUEST)
        }

        return updatedPost;
    }

    async deletePost(id: string): Promise<any> {
        return await this.postRepository.delete(id);
    }
}
