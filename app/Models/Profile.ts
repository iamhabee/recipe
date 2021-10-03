import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public image_url: string

  @column()
  public nick_name: string

  @column()
  public branch: string

  @column()
  public school: string

  @column()
  public class: string

  @column()
  public course_of_study: string

  @column()
  public qualification: string

  @column()
  public no_of_mentor: number

  @column()
  public no_of_mentee: number

  @column()
  public social_media: string

  @column()
  public skills: string

  @column()
  public spiritual_level: number

  @column()
  public availability_status: string

  @column()
  public marital_status: string

  @column()
  public no_of_children: number

  @column()
  public post: string

  @column()
  public address: string

  @column()
  public sex: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
