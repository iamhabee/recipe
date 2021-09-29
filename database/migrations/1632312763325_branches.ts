import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Branches extends BaseSchema {
  protected tableName = 'branches'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('branch_name')
      table.string('branch_address')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('no_of_members')

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
