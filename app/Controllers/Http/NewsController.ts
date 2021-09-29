import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Azkar from 'App/Models/Azkar';
import News from 'App/Models/News';

import { getUserAuth } from "../Traits/auth"
import { pushNotification as notification } from '../Traits/notifications';

export default class NewsController {

  // create news 
  public async create({ auth, response, request }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const title = request.input('title');
        const description = request.input('description');
        const media_type = request.input('media_type');
        const media_file = request.input('media_file');
        const targeted_users = request.input('targeted_users');

        // crete new news notification
        const newsData = await News.create({
          title, description, media_type, media_file, targeted_users
        });
        return response.created({ status: true, message: "News created Successfully", data: newsData })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch all news 
  public async read({ auth, response }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const newsData = await News.all()
        return response.created({ status: true, message: "News fetched Successfully", data: newsData })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch single news 
  public async readOne({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const newsData = await Azkar.find(params.id)
        return response.created({ status: true, message: "News fetched Successfully", data: newsData })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // delete news 
  public async delete({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const news = await News.findOrFail(params.id)
        await news.delete()
        return response.created({ status: true, message: "News deleted Successfully", })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // update news 
  public async update({ auth, response, request, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        // find news to be updated in news table
        const news = await News.findOrFail(params.id)

        // persist the data 
        news.title = request.input('title')
        news.description = request.input('description')
        news.media_type = request.input('media_type')
        news.media_file = request.input('media_file')
        news.targeted_users = request.input('targeted_users')

        // update news row in table
        const newsData = await news.save()

        return response.created({ status: true, message: "News updated Successfully", data: newsData })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  public async pushNotification({ response, request }: HttpContextContract) {
    try {
      // const data = { messge: request.input("message"), title: request.input("title"), link: request.input("link") }
      var message = {
        app_id: "0ce7123b-ad64-43d7-83a8-d6a59d8c35a8",
        contents: { "en": request.input("message") },
        included_segments: ["Subscribed Users"]
      };
      const res = await notification(message)
      return response.send({ message: "notification sent successfully", status: true, data: res })
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

}
