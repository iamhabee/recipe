import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Education from 'App/Models/Education'
import { getUserAuth } from '../Traits/auth'

export default class EducationsController {
  public async create({ request, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { grade, school_name, to, from, course } = request.body()
        await Education.create({ course, from, to, school_name, grade })
        return response.created({ status: true, message: "Education created successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async show({ response }: HttpContextContract) {
    try {
      const data = await Education.all()
      return response.created({ data, status: true, message: "Educations fetche successful" })
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async single({ response, params }: HttpContextContract) {
    try {
      const { id } = params
      const data = await Education.find(id)
      return response.created({ data, status: true, message: "Education fetched successful" })
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { grade, school_name, to, from, course, id } = request.body()
        const data: any = await Education.find(id)
        data.grade = grade
        data.school_name = school_name
        data.to = to
        data.from = from
        data.course = course
        data.save()
        return response.created({ status: true, message: "Education updated successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async delete({ params, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { id } = params
        const data = await Education.find(id)
        data?.delete()
        return response.created({ status: true, message: "Education updated successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }
}
