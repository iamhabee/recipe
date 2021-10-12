import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mentor from 'App/Models/Mentor';
import Event from '@ioc:Adonis/Core/Event'
import { getUserAuth } from '../Traits/auth';
import { getMailData } from '../Traits/SendMail';
import User from 'App/Models/User';

export default class MentorsController {

  public create = async ({ auth, response, request }: HttpContextContract) => {
    try {
      // get user auth
      const authData = await getUserAuth(auth)
      if (authData) {
        const { user_id } = request.body()
        const userData = await User.find(user_id)
        await Mentor.create({ user_id });
        const data = getMailData(userData?.email, "You are now a mentor on academy platform", { fullName: `${userData?.first_name} ${userData?.last_name}` }, "")
        Event.emit('send-mail', data)
        return response.created({ message: 'Mentor created successful', status: true });
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false });
    }
  }

  // fetch all mentor 
  public async read({ auth, response }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const data = await Mentor.query().preload("user")
        return response.created({ status: true, message: "Mentor fetched Successfully", data })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch single mentor 
  public async readOne({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const data = await Mentor.find(params.id)
        await data?.load('user')
        return response.created({ status: true, message: "Mentor fetched Successfully", data })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // delete mentor 
  public async delete({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const mentor = await Mentor.findOrFail(params.id)
        await mentor.delete()
        return response.created({ status: true, message: "Mentor deleted Successfully", })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

}
