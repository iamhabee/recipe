import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import { getUserAuth } from '../Traits/auth'

export default class ClassroomsController {

  // fetch class discussion 
  public async readClassDiscussion({ auth, response, request }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      // check for auth
      if (authData) {
        // const classData = await Classroom.findBy('mentor_mentee_id', params.id)
        const mentee_id = request.input('mentee_id')
        const mentor_id = request.input('mentor_id')
        const classData = await Database
          .query()  // 👈 gives an instance of select query builder
          .from('classes')
          .select('*').where("mentee_id", mentee_id).andWhere('mentor_id', mentor_id)
        return response.created({ status: true, message: "classroom discussions fetched Successfully", data: classData })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }
}
