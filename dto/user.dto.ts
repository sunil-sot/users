import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from "../entities/user.entity";

@Exclude()
export class UserDto {
  constructor(
    partial: Pick<User, "id" | "email" | "name" >,
  ) {
    Object.assign(this, partial);
  }

  @Expose()
  @ApiProperty()
  readonly id: string;

  @Expose()
  @ApiProperty()
  readonly email: string;

  @Expose()
  @ApiProperty()
  readonly name: string;
}
