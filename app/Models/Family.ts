import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Family extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public relationship: string

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public occupation: string

  @column()
  public short_description: string

  @column()
  public long_description: string

  @column()
  public image: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
