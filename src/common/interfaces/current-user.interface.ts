export interface CurrentUser {
  id: string;
  username: string;
  companyId: string;
  branchId: string;
  email?: string;
  roleIds: string[];
}
