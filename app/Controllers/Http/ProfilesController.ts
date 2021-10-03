import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile';
import User from 'App/Models/User';
import Application from '@ioc:Adonis/Core/Application'

import { getUserAuth } from "../Traits/auth";

export default class ProfilesController {

  // update profile
  public async updateProfile({ auth, response, request }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    if (authData) {
      const updateData = {
        phone: request.input('phone'),
        nick_name: request.input('nick_name'),
        branch: request.input('branch'),
        school: request.input('school'),
        class: request.input('class'),
        course_of_study: request.input('course_of_study'),
        qualification: request.input('qualification'),
        no_of_children: request.input('no_of_children'),
        social_media: request.input('social_media'),
        skills: request.input('skills'),
        availability_status: request.input('availability_status'),
        marital_status: request.input('marital_status'),
        post: request.input('post'),
        address: request.input('address'),
        sex: request.input('sex')
      }
      await Profile
        .query()
        .where('user_id', authData.id)
        .update(updateData)
      return response.created({ status: true, message: "Profile Updated successful" })
    } else {
      return response.badRequest({ message: 'user log in expired', status: false })
    }
  }

  // get current user profile
  public async getCurrentUser({ auth, response }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    if (authData) {
      const profile = await User.find(authData.id)
      await profile?.load('profile')
      return response.created({ data: profile })
    } else {
      return response.badRequest({ message: 'user log in expired', status: false })
    }
  }

  // update profile picture
  public async updatePicture({ auth, response, request }: HttpContextContract) {
    try {
      // get user auth
      const authData = await getUserAuth(auth)
      if (authData) {
        const profileImage = request.file('image_url')

        if (profileImage) {
          await profileImage.move(Application.tmpPath('profile'))
          // persit the data
          const updateData = {
            image_url: profileImage.filePath
          }
          // update profile database
          await Profile
            .query()
            .where('user_id', authData.id)
            .update(updateData)
          return response.created({ status: true, message: "Profile picture updated successful" })
        } else {
          return response.created({ status: false, message: "Profile picture updated failed" })
        }
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (message) {
      return response.badRequest({ message, status: false })
    }
  }
}
