import { Role } from '../../common/enums';

export class JwtPayloadDto {
  id: string;
  email: string;
  role: Role;
}
