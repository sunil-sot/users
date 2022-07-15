import { UseGuards } from "@nestjs/common";
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { UserInputError } from "apollo-server-express";
import { GqlCurrentUser } from "../auth/decorator/gql-current-user.decorator";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { UpdateProfileInput } from "./dto/update-profile.input";
import { UserObject } from "./dto/user.object";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import {CreateUserDto} from "./dto/create-user.dto";

@Resolver(() => UserObject)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [UserObject])
  users() {
    return this.usersService.getAll();
  }

  @Query(() => UserObject)
  user(
    @Args("email", { type: () => String, nullable: true }) email?: string
  ) {
    if (!email) {
      throw new UserInputError("Email arguement must be provided.");
    }
    return this.usersService.getUser(email);
  }

  @Query(() => UserObject)
  createUser(
    @Args("user") user: CreateUserDto,
  ) {
    return this.usersService.create(user);
  }

  // @Query(() => UserObject)
  // @UseGuards(GqlAuthGuard)
  // me(@GqlCurrentUser() user: User) {
  //   return user;
  // }
}
