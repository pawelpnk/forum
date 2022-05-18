import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UserRole } from '../user/user.interface/user-role.interface';
 
const RoleGuard = (r: UserRole): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      return user?.role.includes(r);
    }
  }
 
  return mixin(RoleGuardMixin);
}
 
export default RoleGuard;