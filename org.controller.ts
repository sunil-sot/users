import { Body, Controller, Get, Param, Request, UseGuards, Post } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateOrgDto } from "./dto/create-org.dto";
import { Org } from "./entities/org.entity";
import { OrgService } from "./org.service";

@Controller('org')
export class OrgController {
    constructor(private readonly orgService: OrgService) { }

    @Post("create")
    @ApiOkResponse({ status: 201, type: Org })
    async create(@Body() createOrgDto: CreateOrgDto): Promise<Org> {
        return await this.orgService.create(createOrgDto);
    }

    @Get("")
    @ApiOkResponse({ status: 201, type: Org })
    async findAll() {
        return await this.orgService.findAll();
    }

}
