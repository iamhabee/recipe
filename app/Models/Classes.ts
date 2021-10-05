import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class classes extends BaseModel {
  @belongsTo(() => User, {
    foreignKey: 'mentor_id',
  })
  @belongsTo(() => User, {
    foreignKey: 'mentee_id',
  })
  public user: BelongsTo<typeof User>

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
