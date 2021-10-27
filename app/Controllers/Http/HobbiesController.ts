import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hobby from 'App/Models/Hobby'
import { getUserAuth } from '../Traits/auth'
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default class HobbiesController {
  public async create({ request, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { description, name } = request.body()
        let img
        const image = request.file('image')
        if (image) {
          const path = './hobbies/'
          const fileName = cuid() + '.' + image.extname
          image!.moveToDisk(path, {
            overwrite: true, name: fileName
          })
          img = await Drive.getUrl('hobbies/' + fileName)
        }
        await Hobby.create({ image: img, description, name })
        return response.created({ status: true, message: "Hobby created successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async show({ response }: HttpContextContract) {
    try {
      const data = await Hobby.all()
      return response.created({ data, status: true, message: "Hobbies fetched successful" })
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async single({ response, params }: HttpContextContract) {
    try {
      const { id } = params
      const data = await Hobby.find(id)
      return response.created({ data, status: true, message: "Hobby fetched successful" })
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { description, name, id } = request.body()
        const data: any = await Hobby.find(id)
        const image = request.file('image')
        if (image) {
          const path = './hobbies/'
          const fileName = cuid() + '.' + image.extname
          image!.moveToDisk(path, {
            overwrite: true, name: fileName
          })
          data.image = await Drive.getUrl('hobbies/' + fileName)
        }
        data.name = name
        data.description = description
        data.save()
        return response.created({ status: true, message: "Hobbies updated successful" })
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
        const data = await Hobby.find(id)
        data?.delete()
        return response.created({ status: true, message: "Hobby deleted successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }
}


