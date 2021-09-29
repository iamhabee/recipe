import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Branch extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public branch_name: string

  @column()
  public branch_address: string

  @column()
  public user_id: number

  @column()
  public no_of_members: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
