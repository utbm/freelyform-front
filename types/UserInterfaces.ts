export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRoles[];
}

export enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
  CAN_CREATE_FORM = "CAN_CREATE_FORM",
}

export interface UserRolesRequest {
  roles: UserRoles[];
}
