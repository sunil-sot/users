import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { Org } from "./entities/org.entity";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { auditActionTypeENUM } from "..//audit-logs/entities/common";
import { CreateOrgDto } from "./dto/create-org.dto";
import { statusEnum } from "./entities/common";

enum operationType {
  CREATE = "Sponsor Created",
  UPDATE = "Sponsor Updated"
}

@Injectable()
export class OrgService {

  tableName: string

  constructor(
    @InjectRepository(Org)
    private orgRepository: EntityRepository<Org>,
    @Inject(AuditLogsService)
    private auditLog: AuditLogsService
  ) {
    this.auditLog.initialize("org")
    this.tableName = "org";
  }

  async create(createOrgDto: CreateOrgDto): Promise<Org> {
    const name = createOrgDto.name;
    const alreadyCreated = await this.orgRepository.findOne({ name });
    console.log(createOrgDto);

    if (!alreadyCreated) {
      const org = new Org(
        createOrgDto.name,
        createOrgDto.abbreviation,
        createOrgDto.email,
        createOrgDto.phoneNumber,
        statusEnum.ACTIVE,
        createOrgDto.timeZone,
      );
      await this.orgRepository.persist(org);
      await this.orgRepository.flush();

      console.log(await this.auditLog.create({
        type: auditActionTypeENUM.Create,
        entityType: "org",
        entityID: org.id,
        entityName: createOrgDto.name,
        operationType: operationType.CREATE,
        valueBefore: null,
        valueAfter: org,
        ref: {},
        owner: null,
        org: org.id,
        tableName: this.tableName
      }))

      return org;
    }
  }

  async findAll(): Promise<Org[]> {
    return await this.orgRepository.findAll();
  }

  async findOne(id: string): Promise<Org> {
    return this.orgRepository.findOne({ id: id });
  }
}
