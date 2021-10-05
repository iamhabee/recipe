import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Event from '@ioc:Adonis/Core/Event'

import { getUserAuth } from '../Traits/auth'
import Request from 'App/Models/Request'
import { getMailData } from '../Traits/SendMail'
import User from 'App/Models/User'
import Classes from 'App/Models/Classes'

export default class ClassroomsController {

  // fetch class discussion 
  public async readClassDiscussion({ auth, response, request }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      // check for auth
      if (authData) {
        // const classData = await Classes.findBy('mentor_mentee_id', params.id)
        const mentee_id = request.input('mentee_id')
        const mentor_id = request.input('mentor_id')
        const classData = await Database
          .query()  // 👈 gives an instance of select query builder
          .from('classes')
          .select('*').where("mentee_id", mentee_id).andWhere('mentor_id', mentor_id)
        return response.created({ status: true, message: "classroom discussions fetched Successfully", data: classData })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  public async sendRequest({ auth, response, request }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { mentor_id, message } = request.body()
        const mentor = await User.findOrFail(mentor_id)
        await Request.create({ mentor_id, message, mentee_id: authData.id });
        const data = getMailData(mentor.email, message, {}, "")
        Event.emit('send-mail', data)
        return response.created({ message: 'Request sent successful', status: true });
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false });
    }
  }

  public async acceptOrDeclineRequest({ auth, response, request }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { status, message } = request.body()
        const req = await Request.findOrFail(authData.id)
        const mentor = await User.findOrFail(req.mentor_id)
        req.status = status
        req.message = message
        req.save()
        let msg = ""
        if (status === "accept") {
          // send acceptance message to mentee mail
          msg = "Request accepted successfully"
          const data = getMailData(mentor.email, message, {}, "")
          Event.emit('send-mail', data)
        } else {
          // send decline message to mentee mail
          msg = "Request was declined"
          const data = getMailData(mentor.email, message, {}, "")
          Event.emit('send-mail', data)
        }
        return response.created({ message: msg, status: true });
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false });
    }
  }

  // fetch all request
  public async getRequests({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const data = await Request.query().preload("profile", (q) => {
          q.where('mentor_id', params.mentor_id).andWhere('mentee_id', params.mentee_id)
        })
        return response.created({ status: true, message: "Schedules fetched Successfully", data })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch single request
  public async getRequest({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const data = await Request.find(params.id)
        await data?.load('profile')
        return response.created({ status: true, message: "Request fetched Successfully", data })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // create schedule
  public async scheduleClass({ auth, response, request }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { mentee_id, mentor_id, recipient_id, schedule_date } = request.body()
        const userData = await User.find(recipient_id)
        await Classes.create({ mentor_id, mentee_id, schedule_date });
        const data = getMailData(userData?.email, "A meeting has been scheduled for you on Academy platform", { fullName: `${userData?.first_name} ${userData?.last_name}` }, "")
        Event.emit('send-mail', data)
        return response.created({ message: 'Schedule created successful', status: true });
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false });
    }
  }

  // delete schedule
  public async deleteSchedule({ auth, response, params }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const reciter = await Classes.findOrFail(params.id)
        await reciter.delete()
        return response.created({ status: true, message: "Schedule deleted Successfully", })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false });
    }
  }

  // fetch all schedules
  public async getClassSchedules({ auth, response }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const data = await Classes.query().where('mentor_id', authData.id).orWhere('mentee_id', authData.id).preload("user")
        return response.created({ status: true, message: "Schedules fetched Successfully", data })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      console.log(error)
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch single schedule
  public async getClassSchedule({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const { mentee_id, mentor_id, id } = params
        const data = await Classes.query().where('id', id).andWhere('mentor_id', authData.id).orWhere('mentee_id', authData.id).preload("user").first()
        // console.log(data?.mentee_id, data?.mentor_id,  params)
        if (mentee_id == data?.mentee_id && mentor_id == data?.mentor_id) {
          return response.created({ status: true, message: "Scheduled fetched Successfully", data })
        } else {
          return response.unauthorized({ status: false, message: "You are not allowed to see this schedule" })
        }
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

}
