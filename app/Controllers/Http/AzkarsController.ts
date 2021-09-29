import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Azkar from 'App/Models/Azkar';

import { getUserAuth } from "../Traits/auth"

export default class AzkarsController {

  // create azkar 
  public async create({ auth, response, request }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const title = request.input('title');
        const description = request.input('description');
        const azkar_text = request.input('azkar_text');
        const azkar_translation = request.input('azkar_translation');
        const azkar_transliteration = request.input('azkar_transliteration');
        const duration = request.input('duration');
        const time = request.input('time');

        // crete new azkar
        const azkardata = await Azkar.create({
          title, description, azkar_text, azkar_translation, time, duration, azkar_transliteration
        });
        return response.created({ status: true, message: "Azkar created Successfully", data: azkardata })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch all azkar 
  public async read({ auth, response }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const azkardata = await Azkar.all()
        return response.created({ status: true, message: "Azkar fetched Successfully", data: azkardata })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch single azkar 
  public async readOne({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const azkardata = await Azkar.find(params.id)
        return response.created({ status: true, message: "Azkar fetched Successfully", data: azkardata })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // delete azkar 
  public async delete({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const azkar = await Azkar.findOrFail(params.id)
        await azkar.delete()
        return response.created({ status: true, message: "Azkar deleted Successfully", })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // update azkar 
  public async update({ auth, response, request, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        // find azkar to be updated in azkar table
        const azkar = await Azkar.findOrFail(params.id)

        // persist the data 
        azkar.title = request.input('title')
        azkar.description = request.input('description')
        azkar.azkar_text = request.input('azkar_text')
        azkar.azkar_translation = request.input('azkar_translation')
        azkar.azkar_transliteration = request.input('azkar_transliteration')
        azkar.duration = request.input('duration')
        azkar.time = request.input('time')

        // update azkar row in table
        const azkarData = await azkar.save()

        return response.created({ status: true, message: "Azkar updated Successfully", data: azkarData })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

}
