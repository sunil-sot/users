import { Body, Controller, Get, Param, Request, UseGuards, Post } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import {CreateUserDto} from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { UserObject } from "./dto/user.object";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Get('all')
  @ApiOkResponse({ status: 200, type: User, isArray: true })
  async getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get(':userId')
  @ApiOkResponse({ status: 200, type: User })
  async getUser(@Param('userId') userId: string): Promise<UserObject> {
    return await this.usersService.getUser(userId);
  }

  @Post("create")
  @ApiOkResponse({ status: 201, type: User })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

 

  // @UseGuards(JwtAuthGuard)
  // @Get("me")
  // @ApiOkResponse({
  //   description: "Returns the logged-in user.",
  //   type: UserDto,
  // })
  // getProfile(@CurrentUser() user: User) {
  //   return user && new UserDto(user);
  // }
}
