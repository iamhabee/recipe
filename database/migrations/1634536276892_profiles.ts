import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Profiles extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('short_description', 150).notNullable()
      table.string('long_description').notNullable()
      table.string('family')
      table.string('event')
      table.string('marital_status')
      table.string('religion')
      table.string('address')
      table.string('image')
      table.string('phone')
      table.string('facebook')
      table.string('facebook_follower')
      table.string('twitter')
      table.string('twitter_follower')
      table.string('instagram')
      table.string('instagram_follower')

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
