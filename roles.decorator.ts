import { SetMetadata } from "@nestjs/common";
import { rolesEnum as Role } from "./entities/common";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);