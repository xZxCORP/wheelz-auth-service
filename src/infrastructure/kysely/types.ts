import { ColumnType, Generated, Selectable } from "kysely"

export interface Database {
    authorization: UserAuthorizationTable
}

export interface UserAuthorizationTable {
    id: Generated<number>
    userId: ColumnType<number>
    password: ColumnType<string>
    salt: ColumnType<string>
    created_at: ColumnType<Date, never, never>
  }

export type Authorization = Selectable<UserAuthorizationTable>
