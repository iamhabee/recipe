import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Azkars extends BaseSchema {
  protected tableName = 'azkars'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.string('description')
      table.string('azkar_text')
      table.string('azkar_translation')
      table.string('azkar_transliteration')
      table.integer('duration')
      table.integer('time')
      table.string('audio_file')

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
