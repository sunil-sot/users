import { Field, Int, ObjectType } from "@nestjs/graphql";
import {rolesEnum, statusEnum} from "../entities/common";
import { Org } from "../entities/org.entity";

@ObjectType("User")
export class UserObject {
  @Field(() => Int)
  readonly id: string;

  @Field()
  readonly email: string;

  @Field({ nullable: true })
  readonly name: string;

  @Field()
  readonly phoneNumber: string;

  @Field()
  readonly role: rolesEnum;

  @Field()
  readonly org: Org;


  @Field()
  readonly status: statusEnum;

}
