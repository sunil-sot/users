import { InputType, OmitType, PartialType } from "@nestjs/graphql";
import { Field, Int, ObjectType } from "@nestjs/graphql";

import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';
import {rolesEnum} from '../entities/common';

@InputType()

export class CreateOrgDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  abbreviation: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Field()
  @IsPhoneNumber(null)
  phoneNumber: string
  
  @Field()
  @IsNotEmpty()
  timeZone: string;
}