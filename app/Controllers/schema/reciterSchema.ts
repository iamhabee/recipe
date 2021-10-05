
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export const reciterSchema = schema.create({
  user_id: schema.string({}, [rules.unique({ table: 'reciters', column: 'user_id' })])
})