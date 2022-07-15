import {
    Entity,
    Property,
    PrimaryKey,
    Unique,
    Enum
  } from "@mikro-orm/core";
  import { v4 as uuid } from 'uuid';
  import { BaseEntity } from "../../database/entities/base-entity.entity";
  import { statusEnum } from "./common";
  import { IsEmail, IsOptional } from 'class-validator';
  
  
  @Entity({ tableName: "org" })
  export class Org extends BaseEntity {
   
    @PrimaryKey()
    id: string = uuid();
  
    @Property()
    name: string;

    @Property()
    abbreviation: string;
  
    @Property()
    @Unique()
    @IsEmail()
    email: string;
  
    @Property()
    @IsOptional()
    phoneNumber: string


    @Enum(() => statusEnum)
    status: statusEnum = statusEnum.ACTIVE

    @Property()
    @IsOptional()
    timeZone: string
    
    constructor(
      name: string,
      abbreviation: string,
      email: string,
      phoneNumber: string,
      status?: statusEnum,
      timeZone?: string
    ) {
      super()
      this.name = name;
      this.abbreviation = abbreviation;
      this.email = email;
      this.phoneNumber= phoneNumber;
      this.status = (typeof status == 'undefined')? statusEnum.ACTIVE: status;
      this.timeZone = timeZone || null;
    }
  }
  