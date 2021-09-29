
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export const userSchema = schema.create({
  name: schema.string({ trim: true }),
  password: schema.string({}, [rules.confirmed(), rules.minLength(8)]),
  email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })])
})