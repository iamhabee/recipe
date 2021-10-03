
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export const userSchema = schema.create({
  first_name: schema.string({ trim: true }),
  last_name: schema.string({ trim: true }),
  phone_number: schema.string({ trim: true }),
  password: schema.string({}, [rules.confirmed(), rules.minLength(8)]),
  email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })])
})

export const emailUpdateSchema = schema.create({
  email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })])
})