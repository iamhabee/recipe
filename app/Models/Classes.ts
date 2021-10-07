import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class classes extends BaseModel {
  @belongsTo(() => User, {
    foreignKey: 'mentor_id',
  })
  public mentor: BelongsTo<typeof User>
  @belongsTo(() => User, {
    foreignKey: 'mentee_id',
  })
  public mentee: BelongsTo<typeof User>

  @column({ isPrimary: true })
  public id: number

  @column()
  public mentor_id: number

  @column()
  public mentee_id: number

  @column()
  public mentor_report: string

  @column()
  public mentee_report: string

  @column()
  public mentor_comment: string

  @column()
  public mentee_comment: string

  @column()
  public mentor_ratings: number

  @column()
  public mentee_ratings: number

  @column()
  public objectives: string

  @column()
  public status: string

  @column.dateTime()
  public schedule_date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
