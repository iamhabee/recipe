import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
// import Profile from './Profile'
import User from './User'

export default class Request extends BaseModel {

  @belongsTo(() => User, {
    foreignKey: 'mentor_id', // defaults to userId
  })
  public mentor: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'mentee_id', // defaults to userId
  })
  public mentee: BelongsTo<typeof User>

  @column({ isPrimary: true })
  public id: number

  @column()
  public mentor_id: number

  @column()
  public mentee_id: number

  @column()
  public mentor_status: string

  @column()
  public mentee_status: string

  @column()
  public mentor_comment: string

  @column()
  public mentee_comment: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
