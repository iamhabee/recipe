import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Admin {
  public async handle({ response, auth }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const au = auth.use('api').toJSON().user
    if (au.user_type === "admin") {
      return response.unauthorized({ message: 'Must be an admin', status: false })
    }
    await next()
  }
}
