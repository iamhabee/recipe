import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getUserAuth } from '../Traits/auth'
import Family from 'App/Models/Family'
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default class FamiliesController {

  public async create({ request, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { first_name, last_name, long_description, occupation, relationship, short_description } = request.body()
        let img
        const image = request.file('image')
        if (image) {
          const path = './images/families'
          const fileName = cuid() + '.' + image.extname
          image!.moveToDisk(path, {
            overwrite: true, name: fileName
          })
          img = await Drive.getUrl('images/families' + fileName)
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
        const { first_name, last_name, long_description, occupation, relationship, short_description, id } = request.body()
        const data: any = await Family.find(id)
        const image = request.file('image')
        if (image) {
          const path = './images/families'
          const fileName = cuid() + '.' + image.extname
          image!.moveToDisk(path, {
            overwrite: true, name: fileName
          })
          data.image = await Drive.getUrl('images/families' + fileName)
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
