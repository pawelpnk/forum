import { Body, Controller, Get, HttpStatus, Patch, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserObj } from 'src/decorators/user.decorator';
import { NotiService } from './noti.service';

@Controller('noti')
export class NotiController {
    constructor(private notiService: NotiService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async UpdateDisplayNotification (
        @UserObj() user,
        @Res() res: Response
    ) {
        try {
            const result = await this.notiService.UpdateDisplayNotification(user);
            return res.status(HttpStatus.OK).json({
                positive: true
            })
        } catch {
            return res.json({
                message: "Błąd"
            })
        }
    }
}
