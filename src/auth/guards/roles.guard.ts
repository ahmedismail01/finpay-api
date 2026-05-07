import { Injectable  , CanActivate, ExecutionContext} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {}
  canActivate(context: ExecutionContext): Promise<boolean> | Observable<boolean> | boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if(!requiredRoles){
      return true;
    }

    return requiredRoles.includes(user.role);
  }
}