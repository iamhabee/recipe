import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public title: string

  @column()
  public location: string

  @column()
  public occassion: string

  @column()
  public image: string

  @column()
  public description: string

  @column()
  public date: Date

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
