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
        const { mentor_id, mentee_id, message } = request.body()
        const mentor = await User.find(mentor_id)
        const mentee = await User.find(mentee_id)
        if (mentor && mentee) {
          await Request.create({ mentor_id, mentee_id });
          const data = getMailData(mentor?.email, message, { firstname: mentor.first_name }, "")
          Event.emit('mentor-mentee-request', data)
          return response.created({ message: 'Request sent successful', status: true });
        } else {
          return response.created({ message: 'Mentor or mentee not found', status: false });
        }
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
        const { status, id, comment, recipient_id } = request.body()
        const req = await Request.findOrFail(id)
        const recipient = await User.findOrFail(recipient_id)
        if (recipient_id === req.mentor_id) {
          req.mentee_status = status
          req.mentee_comment = comment
        } else {
          req.mentor_status = status
          req.mentor_comment = comment
        }
        req.save()
        // send acceptance message to mentee mail
        const data = getMailData(recipient.email, comment, {}, "")
        Event.emit('send-mail', data)
        return response.created({ message: "Update success", status: true });
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false });
    }
  }

  // fetch all my mentor request
  public async getRequests({ auth, response }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const data = await Request.query().preload("mentee").preload("mentor")
        return response.created({ status: true, message: "Requests fetched Successfully", data })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      console.log(error)
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch all my mentor request
  public async getMyMentor({ auth, response }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const data = await Request.query().where('mentee_id', authData.id).andWhere('mentor_status', "ACCEPT").andWhere('mentee_status', "ACCEPT").preload("mentor")
        return response.created({ status: true, message: "My mentors fetched Successfully", data })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch all my mentor request
  public async getMyMentee({ auth, response }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const data = await Request.query().where('mentor_id', authData.id).andWhere('mentor_status', "ACCEPT").andWhere('mentee_status', "ACCEPT").preload("mentee")
        return response.created({ status: true, message: "My mentees fetched Successfully", data })
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
        const data = await Request.query().where('id', params.id).preload("mentee").preload("mentor")
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
        const { mentee_id, mentor_id, recipient_id, schedule_date, objectives } = request.body()
        const userData = await User.find(recipient_id)
        await Classes.create({ mentor_id, mentee_id, schedule_date, objectives });
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
        const data = await Classes.query().where('mentor_id', authData.id).orWhere('mentee_id', authData.id).preload("mentor")
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
        const { id } = params
        const data = await Classes.query().where('id', id).preload("mentor").preload('mentee')
        return response.created({ status: true, message: "Scheduled fetched Successfully", data })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // send scheduled meetings report by both mentor and mentee
  public async sendClassReport({ auth, response, request }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const { report, schedule_id, recipient_id } = request.body()
        const classes = <any>await Classes.find(schedule_id)
        if (classes) {
          if (classes.status.toLowerCase() === "close") {
            return response.created({ status: false, message: "Sorry this class has been closed" })
          }
          if (recipient_id === classes.mentee_id) {
            if (!classes.mentee_report) {
              return response.created({ status: false, message: "Sorry mentee report is yet to be submitted" })
            } else {
              classes.mentor_report = report
            }
          } else {
            classes.mentee_report = report
          }
          classes.save()
          return response.created({ status: true, message: "Report submitted Successfully" })
        } else {
          return response.badRequest({ status: false, message: "Meeting not available" })
        }
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // ratings and comment
  public async rate({ auth, response, request }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const { ratings, comments, schedule_id, recipient_id } = request.body()
        const classes = <any>await Classes.find(schedule_id)
        if (classes) {
          if (recipient_id === classes?.mentor_id) {
            classes.mentee_ratings = ratings
            classes.mentee_comment = comments
          } else {
            classes.mentor_ratings = ratings
            classes.mentor_comment = comments
          }
          classes.save()
          return response.created({ status: true, message: "Ratings Successful" })
        } else {
          return response.badRequest({ status: false, message: "Meeting not available" })
        }
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  public async updateSchedule({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const { id, status } = params
        const classes = <any>await Classes.find(id)
        if (classes) {
          classes.status = status.toUpperCase()
          classes.save()
          return response.created({ status: true, message: `Meeting ${status.toLowerCase()} successful` })
        } else {
          return response.badRequest({ status: false, message: "Meeting not available" })
        }
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

}
