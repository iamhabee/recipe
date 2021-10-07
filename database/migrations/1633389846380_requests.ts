import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Requests extends BaseSchema {
  protected tableName = 'requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('mentor_id')
      table.integer('mentee_id')
      table.string('mentor_status').defaultTo("pending")
      table.string('mentee_status').defaultTo("pending")
      table.string('mentor_comment')
      table.string('mentee_comment')

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