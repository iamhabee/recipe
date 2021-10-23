import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'
import { getUserAuth } from '../Traits/auth'
import Application from '@ioc:Adonis/Core/Application'

export default class EventsController {
  public async create({ request, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { date, description, location, occassion, title } = request.body()
        let img
        const image = request.file('image')
        if (image) {
          await image.move(Application.tmpPath('events'))
          img = image.filePath
        }
        await Event.create({ date, description, image: img, location, occassion, title })
        return response.created({ status: true, message: "Event created successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async show({ response }: HttpContextContract) {
    try {
      const data = await Event.all()
      return response.created({ data, status: true, message: "Events fetche successful" })
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async single({ response, params }: HttpContextContract) {
    try {
      const { id } = params
      const data = await Event.find(id)
      return response.created({ data, status: true, message: "Event fetched successful" })
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { date, description, location, occassion, title, id } = request.body()
        const data: any = await Event.find(id)
        let img
        const image = request.file('image')
        if (image) {
          await image.move(Application.tmpPath('events'))
          img = image.filePath
        }
        data.date = date
        data.description = description
        data.location = location
        data.occassion = occassion
        data.title = title
        data.image = img
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
        const data = await Event.find(id)
        data?.delete()
        return response.created({ status: true, message: "Event updated successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }
}
