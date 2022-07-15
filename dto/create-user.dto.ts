import { InputType, OmitType, PartialType } from "@nestjs/graphql";
import { Field, Int, ObjectType } from "@nestjs/graphql";

import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';
import {rolesEnum} from '../entities/common';
import { Org } from "../entities/org.entity";

@InputType()

export class CreateUserDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Field()
  @IsPhoneNumber(null)
  phoneNumber: string
  
  @Field()
  @IsNotEmpty()
  role: rolesEnum;

  @Field()
  @IsString(null)
  roleTitle: string;

  @Field()
  @IsNotEmpty()
  org: Org;
}