import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat';
import { pushNotification } from '../Traits/notifications';
import News from 'App/Services/News';
import { getUserAuth } from '../Traits/auth'
News.boot()

export default class ChatsController {

  public async create({ auth, request, response }: HttpContextContract) {
    try {
      // get user auth
      const authData = await getUserAuth(auth)
      let file_path
      if (authData) {
        const { message, message_type, file, sender_id, recipient_id, app_id } = request.body()
        if (file) {
          await file.move(Application.tmpPath('chats'))
          file_path = file.filePath
        }
        // send new message
        const data = await Chat.create({
          message, file_path, sender_id, recipient_id, message_type
        });
        // emit new message
        News.io.on('connection', (socket) => {
          socket.to(app_id).emit('recieve-message', { hello: 'world' })
        })
        // send one signal notification
        var dat = {
          app_id: "0ce7123b-ad64-43d7-83a8-d6a59d8c35a8",
          contents: { "en": request.input("message") },
          included_segments: [app_id]
        };
        await pushNotification(dat)

        return response.created({ message: 'message sent', status: true, data })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch {
      return response.badRequest({ message: 'Invalid credentials', status: false })
    }
  }
}
