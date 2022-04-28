import { Controller, HttpStatus, Patch, Res, Sse, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { interval, map, Observable, switchMap } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserObj } from 'src/decorators/user.decorator';
import { NotiService } from './noti.service';

@Controller('noti')
export class NotiController {
    constructor(private notiService: NotiService) {}

    @UseGuards(JwtAuthGuard)
    @Patch()
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

    @UseGuards(JwtAuthGuard)
    @Sse('sse')
    sse(@UserObj() user): Observable<any> {
        return interval(10000).pipe(
            switchMap(() => this.notiService.getNoti(user)),
            map((noti: any) => ({
                data: {
                    noti
                }
            }))
        )
    }
}
