import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Profiles extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('image_url')
      table.string('nick_name')
      table.string('branch')
      table.string('school')
      table.string('class')
      table.string('course_of_study')
      table.string('qualification')
      table.integer('no_of_mentor')
      table.integer('no_of_mentee')
      table.string('social_media')
      table.string('skills')
      table.integer('spiritual_level')
      table.string('availability_status')
      table.string('marital_status')
      table.integer('no_of_children')
      table.string('post')
      table.string('address')
      table.string('sex')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
