import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Reciter from 'App/Models/Reciter';
import { validator } from '@ioc:Adonis/Core/Validator';
import { reciterSchema } from '../schema/reciterSchema';

import { getUserAuth } from "../Traits/auth"

export default class RecitersController {

  // create reciter 
  public async create({ auth, response, request }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        await request.validate({
          schema: reciterSchema,
          reporter: validator.reporters.api
        })
        const { user_id, level } = request.body();
        // crete new reciter
        const data = await Reciter.create({ user_id, level });
        return response.created({ status: true, message: "Reciter created Successfully", data })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch all reciter 
  public async read({ auth, response }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const data = await Reciter.query().preload("profile")
        return response.created({ status: true, message: "Reciters fetched Successfully", data })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch single reciter 
  public async readOne({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const data = await Reciter.find(params.id)
        await data?.load('profile')
        return response.created({ status: true, message: "Reciter fetched Successfully", data })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // delete reciter 
  public async delete({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const reciter = await Reciter.findOrFail(params.id)
        await reciter.delete()
        return response.created({ status: true, message: "Reciter deleted Successfully", })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }
}
