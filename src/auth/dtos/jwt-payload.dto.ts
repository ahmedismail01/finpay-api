import { Role } from '../../common/enums';

export class JwtPayloadDto {
  id: number;
  email: string;
  role: Role;
}
