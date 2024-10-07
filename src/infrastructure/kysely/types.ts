import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely"

export interface Database {
    user_authentification: UserAuthorizationTable
}

export interface UserAuthorizationTable {
    id: Generated<number>
    user_id: ColumnType<number>
    password: ColumnType<string>
    salt: ColumnType<string>
    created_at: ColumnType<Date, never, never>
  }

export type Authorization = Selectable<UserAuthorizationTable>
export type NewAuthorization = Insertable<UserAuthorizationTable>
export type AuthorizationUpdate = Updateable<UserAuthorizationTable>
