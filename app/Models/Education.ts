import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Education extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public school_name: string

  @column()
  public course: string

  @column()
  public grade: string

  @column()
  public from: Date

  @column()
  public to: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
