import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserModel } from '../models/current-user.model';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): CurrentUserModel => {
    const request = context.switchToHttp().getRequest();

    return (request.user || {
      id: '00000000-0000-0000-0000-000000000000',
      username: 'system',
      email: 'system@wms.local',
      companyId: 'company-1',
      branchId: 'branch-1',
      roleIds: [],
      permissions: [],
    }) as CurrentUserModel;
  },
);
