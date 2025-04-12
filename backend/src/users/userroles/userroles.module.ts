import { Module } from '@nestjs/common';
import { UserrolesService } from './userroles.service';
import { UserrolesController } from './userroles.controller';

@Module({
  providers: [UserrolesService],
  controllers: [UserrolesController]
})
export class UserrolesModule {}
