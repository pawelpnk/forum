import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/entity/group.entity';
import { UserModule } from 'src/user/user.module';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group]),
    forwardRef(()=>UserModule),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [
    GroupService
  ]
})
export class GroupModule {}
