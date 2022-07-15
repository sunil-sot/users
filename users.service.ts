import { EntityRepository, expr } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { UserObject } from "./dto/user.object";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { auditActionTypeENUM } from "src/audit-logs/entities/common";

enum operationType {
  CREATE = "User Created",
  UPDATE = "User Updated"
}

@Injectable()
export class UsersService {

  tableName: string

  constructor(
    @InjectRepository(User)
    private usersRepository: EntityRepository<User>,
    @Inject(AuditLogsService)
    private auditLog: AuditLogsService
  ) {
    this.auditLog.initialize("user")
    this.tableName = "users";
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const email = createUserDto.email;
    const alreadyCreated = await this.usersRepository.findOne({ email });
    console.log(createUserDto);

    if (!alreadyCreated) {
      const user = new User(
        createUserDto.name,
        createUserDto.email,
        createUserDto.phoneNumber,
        createUserDto.role,
        createUserDto.roleTitle,
        createUserDto.org
      );
      await this.usersRepository.persist(user);
      await this.usersRepository.flush();

      console.log(await this.auditLog.create({
        type: auditActionTypeENUM.Create,
        entityType: "user",
        entityID: user.id,
        entityName: createUserDto.name,
        operationType: operationType.CREATE,
        valueBefore: null,
        valueAfter: user,
        ref: {},
        owner: user,
        org: createUserDto.org.toString(),
        tableName: this.tableName
      }))

      return user;
    }
  }

  async bulkCreate(createUserDto: Array<CreateUserDto>, owner: any): Promise<any> {
    let emails = createUserDto.map(user => user.email);
    let existingUsers = await this.usersRepository.find({ email: { $in: emails } })
    let toBeInserted = []
    let toBeUpdated = []
    let processedRow = []
    if (existingUsers.length > 0) {
      let existingUserIds = existingUsers.map((user) => user.email)
      createUserDto.forEach(row => {
        if (!existingUserIds.includes(row['email'])) toBeInserted.push(row)
        else {
          const userRecord = existingUsers.find(user => user.email == row["email"]);  
          toBeUpdated.push({
            ...row,
            id: userRecord.id,
          });
        }
      })
    } else {
      createUserDto.forEach(row => {
        const duplicateInSheet = toBeInserted.find( item => item.email == row.email );
        if(!duplicateInSheet) toBeInserted.push(row)
      })
    }
    console.log(existingUsers, toBeInserted)

    toBeInserted.forEach(user => {
      const userRow = new User(
        user.name,
        user.email,
        user.phoneNumber,
        user.role,
        user.roleTitle,
        user.org
      );
      processedRow.push(userRow)
    })


    await this.usersRepository.persist(processedRow);
    await this.usersRepository.flush();

    toBeUpdated.forEach( async user => {
      const updateValue = {
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        roleTitle: user.roleTitle,
      };
      await this.usersRepository.nativeUpdate({ email: user.email }, updateValue);
      await this.auditLog.create({
        type: auditActionTypeENUM.Update,
        entityType: "user",
        entityID: user.id,
        entityName: user.name,
        operationType: operationType.UPDATE,
        valueBefore: null,
        valueAfter: updateValue,
        ref: {},
        owner: owner.id,
        org: user.org,
        tableName: this.tableName
      })
    });

    processedRow.forEach(async user => {
      await this.auditLog.create({
        type: auditActionTypeENUM.Create,
        entityType: "user",
        entityID: user.id,
        entityName: user.name,
        operationType: operationType.CREATE,
        valueBefore: null,
        valueAfter: user,
        ref: {},
        owner: owner.id,
        org: user.org,
        tableName: this.tableName
      })
    })
    return { inserted: toBeInserted.length }
  }

  async getAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  async getUser(email: string): Promise<UserObject> {
    const user: UserObject = await this.usersRepository.findOne({ $or: [{ email: email }, { id: email }] }, { populate: ['org']});

    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    return user;
  }
}
