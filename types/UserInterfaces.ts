// types/UserInterfaces.ts

// Interface used to cast users from the service (NOT JWT User)
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRoles[];
}

// Interface used to represent the roles of a User
export enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
  CAN_CREATE_FORM = "CAN_CREATE_FORM",
}

// Interface used to cast roles of a user to update them in the service
export interface UserRolesRequest {
  roles: UserRoles[];
}
