import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserObj } from 'src/decorators/user.decorator';
import RoleGuard from 'src/guard/roles.guards';
import { UserRole } from 'src/interface/user-role.interface';
import NewPost from './post.dto/new-post.dto';
import { RateUpdatePost } from './post.dto/rate-update-post';
import UpdatePost from './post.dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/new')
    async addNewPost(
        @Res() res: Response,
        @Body() postDTO: NewPost,
        @UserObj() user
    ) {
        try {
            const addedPost = await this.postService.createPost(postDTO, user);
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

    @UseGuards(JwtAuthGuard)
    @Patch('/update/:id')
    async updatePost(
        @Res() res: Response,
        @Body() bodyUpdatePost: UpdatePost,
        @Param('id') id: string,
        @UserObj() user
    ) {
        try {
            const updatePost = await this.postService.updatePost(id, bodyUpdatePost, user);
            return res.status(HttpStatus.OK).json({
                message: "Zaaktualizowano pomyślnie",
                updatePost
            })
        } catch (err) {
            return res.json({
                message: err.message
            })
        }
    }

    @UseGuards(JwtAuthGuard)
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

    @UseGuards(RoleGuard(UserRole.ADMIN))
    @UseGuards(JwtAuthGuard)
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
