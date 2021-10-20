import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { getUserAuth } from '../Traits/auth'
import Family from 'App/Models/Family'

export default class FamiliesController {

  public async create({ request, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { first_name, last_name, long_description, occupation, relationship, short_description, image } = request.body()
        let img
        if (image) {
          await image.move(Application.tmpPath('families'))
          img = image.filePath
        }
        await Family.create({ image: img, first_name, last_name, long_description, occupation, relationship, short_description })
        return response.created({ status: true, message: "Family created successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async show({ response }: HttpContextContract) {
    try {
      const data = await Family.all()
      return response.created({ data, status: true, message: "Families fetched successful" })
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async single({ response, params }: HttpContextContract) {
    try {
      const { id } = params
      const data = await Family.find(id)
      return response.created({ data, status: true, message: "Family fetched successful" })
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { first_name, last_name, long_description, occupation, relationship, short_description, image, id } = request.body()
        const data: any = await Family.find(id)
        let img
        if (image) {
          await image.move(Application.tmpPath('families'))
          img = image.filePath
          data.image = img
        }
        data.first_name = first_name
        data.last_name = last_name
        data.long_description = long_description
        data.short_description = short_description
        data.occupation = occupation
        data.relationship = relationship
        data.save()
        return response.created({ status: true, message: "Family updated successful" })
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
        const data = await Family.find(id)
        data?.delete()
        return response.created({ status: true, message: "Family deleted successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }
}
