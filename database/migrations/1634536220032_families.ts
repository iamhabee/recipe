import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Families extends BaseSchema {
  protected tableName = 'families'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('relationship', 50).notNullable()
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('occupation', 50).notNullable()
      table.string('short_description', 255).notNullable()
      table.string('long_description').notNullable()
      table.string('image')

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
