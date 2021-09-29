import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Classroom extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public mentor_id: number

  @column()
  public mentee_id: number

  @column()
  public status: string

  @column.dateTime()
  public schedule_date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
