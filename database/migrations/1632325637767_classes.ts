import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Classes extends BaseSchema {
  protected tableName = 'classes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('mentor_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('mentee_id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('objectives')
      table.string('mentor_report')
      table.string('mentee_report')
      table.integer('mentee_ratings')
      table.integer('mentor_ratings')
      table.string('mentor_comment')
      table.string('mentee_comment')
      table.string('status')
      table.dateTime('schedule_date')

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
