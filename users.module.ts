import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";
import {AuditLogsModule} from "../audit-logs/audit-logs.module";
import { OrgService } from './org.service';
import { Org } from "./entities/org.entity";

@Module({
  imports: [MikroOrmModule.forFeature([User, Org]), AuditLogsModule],
  controllers: [UsersController],
  providers: [UsersResolver, UsersService, OrgService],
  exports: [UsersService, OrgService],
})
export class UsersModule {}
