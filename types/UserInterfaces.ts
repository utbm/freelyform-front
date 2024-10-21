export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: {
    IS_ADMIN: boolean;
    CAN_CREATE_PREFAB: boolean;
  };
}
