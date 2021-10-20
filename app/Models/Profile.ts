import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public image: string

  @column()
  public short_description: string

  @column()
  public marital_status: string

  @column()
  public long_description: string

  @column()
  public family: string

  @column()
  public event: number

  @column()
  public religion: string

  @column()
  public address: string

  @column()
  public phone: string

  @column()
  public facebook: string

  @column()
  public facebook_follower: string

  @column()
  public twitter: string

  @column()
  public twitter_follower: string

  @column()
  public instagram: string

  @column()
  public instagram_follower: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
