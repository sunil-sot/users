import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
  PrimaryKey,
  Unique,
  Enum,
  ManyToOne
} from "@mikro-orm/core";
import { v4 as uuid } from 'uuid';
import { BaseEntity } from "../../database/entities/base-entity.entity";
import { statusEnum, rolesEnum } from "./common";
import { IsEmail, IsOptional } from 'class-validator';
import { Org } from "./org.entity";


@Entity({ tableName: "users" })
export class User extends BaseEntity {
 
  @PrimaryKey()
  id: string = uuid();

  @Property()
  name: string;

  @Property()
  @Unique()
  @IsEmail()
  email: string;

  @Property({nullable: true})
  @IsOptional()
  phoneNumber: string

  @Enum(() => rolesEnum)
  role: rolesEnum;

  @Property({nullable: true})
  roleTitle: string;

  @ManyToOne()
  org: Org;

  @Enum(() => statusEnum)
  status: statusEnum = statusEnum.ACTIVE

  // refreshTokens = new Collection<RefreshToken>(this);

  constructor(
    name: string,
    email: string,
    phoneNumber: string,
    role: rolesEnum,
    roleTitle: string,
    org: Org,
    status?: statusEnum
  ) {
    super()
    this.name = name;
    this.email = email;
    this.phoneNumber= phoneNumber;
    this.role = role;
    this.roleTitle = roleTitle;
    this.org = org;
    this.status = (typeof status == 'undefined')? statusEnum.ACTIVE: status
  }
}
