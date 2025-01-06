import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  user_authentification: UserAuthorizationTable;
  role: RoleTable,
  user_role: UserRoleTable,
}

export interface UserAuthorizationTable {
  id: Generated<number>;
  user_id: ColumnType<number>;
  password: ColumnType<string>;
  salt: ColumnType<string>;
  created_at: ColumnType<Date, never, never>;
}

export type Authorization = Selectable<UserAuthorizationTable>;
export type NewAuthorization = Insertable<UserAuthorizationTable>;
export type AuthorizationUpdate = Updateable<UserAuthorizationTable>;

export interface RoleTable {
  id: Generated<number>;
  name: ColumnType<string>;
  created_at: ColumnType<Date, never, never>;
};

export type Role = Selectable<RoleTable>
export type NewRole = Insertable<RoleTable>
export type RoleUpdate = Updateable<RoleTable>

export interface UserRoleTable {
  user_id: ColumnType<number>;
  role_id: ColumnType<number>;
  created_at: ColumnType<Date, never, never>;
}

export type UserRole = Selectable<UserRoleTable>
export type NewUserRole = Insertable<UserRoleTable>
export type RoleUserUpdate = Updateable<UserRoleTable>
