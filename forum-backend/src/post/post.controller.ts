import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import NewPost from './post.dto/new-post.dto';
import { RateUpdatePost } from './post.dto/rate-update-post';
import UpdatePost from './post.dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @Post('/new')
    async addNewPost(
        @Res() res: Response,
        @Body() postDTO: NewPost
    ) {
        try {
            const addedPost = await this.postService.createPost(postDTO);
            return res.status(HttpStatus.OK).json({
                message: "Dodano nowy post",
                addedPost
            })
        } catch (err) {
            return res.json({
                message: err
            })
        }       
    }

    @Get('/all/:id')
    async fetchAllPosts(
        @Res() res: Response,
        @Param('id') idTopic: string
    ) {
        try {
            const fetchAllPosts = await this.postService.fetchAllPosts(idTopic);
            return res.status(HttpStatus.OK).json(fetchAllPosts);
        } catch (err) {
            return res.json({
                message: err
            })
        }
    }

    @Patch('/update/:id')
    async updatePost(
        @Res() res: Response,
        @Body() bodyUpdatePost: UpdatePost,
        @Param('id') id: string
    ) {
        try {
            const updatePost = await this.postService.updatePost(id, bodyUpdatePost);
            return res.status(HttpStatus.OK).json({
                message: "Zaaktualizowano pomyślnie",
                updatePost
            })
        } catch (err) {
            return res.json({
                message: err
            })
        }
    }

    @Patch('update/rate/:id')
    async changeRatePost (
        @Res() res: Response,
        @Body() rateUpdatePost: RateUpdatePost,
        @Param('id') id: string
    ) {
        try {
            const changeRate = await this.postService.changeRate(id, rateUpdatePost);
            return res.status(HttpStatus.OK).json({
                message: 'Pomyślnie zmieniono ocene',
                changeRate
            })
        } catch {
            return res.json({
                message: "Błąd"
            })
        }
    }

    @Delete('/delete/:id')
    async deletePost(
        @Res() res: Response,
        @Param('id') idPost: string
    ) {
        try {
            await this.postService.deletePost(idPost);
            return res.status(HttpStatus.OK).json({
                message: "Post został usunięty"
            });
        } catch {
            return res.json({
                message: "Wystąpił błąd"
            })
        }
    }
}
