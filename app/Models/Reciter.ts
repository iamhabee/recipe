import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'

export default class Reciter extends BaseModel {

  @hasOne(() => Profile, {
    foreignKey: 'user_id', // defaults to userId
  })
  public profile: HasOne<typeof Profile>

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public status: string

  @column()
  public level: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
