import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile';
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'

import { getUserAuth } from "../Traits/auth";

export default class ProfilesController {

  // update profile
  public async updateProfile({ auth, response, request }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    if (authData) {
      const { instagram, short_description, long_description, address, event, facebook, facebook_follower, family, instagram_follower, marital_status, phone, religion, twitter, twitter_follower } = request.body()
      let img
      const image = request.file('image')
      if (image) {
        const path = './profile/'
        const fileName = cuid() + '.' + image.extname
        image!.moveToDisk(path, {
          overwrite: true, name: fileName
        })
        img = await Drive.getUrl('/profile/' + fileName)
      }
      await Profile.create({ instagram, image: img, short_description, long_description, address, event, facebook, facebook_follower, family, instagram_follower, marital_status, phone, religion, twitter, twitter_follower })
      return response.created({ status: true, message: "Profile Updated successful" })
    } else {
      return response.badRequest({ message: 'user log in expired', status: false })
    }
  }

  // get current user profile
  public async getCurrentUser({ response }: HttpContextContract) {
    // const authData = await getUserAuth(auth)
    // if (authData) {
    try {
      const data = await Profile.find(1)
      return response.created({ data, message: "profile fetched successful", status: true })
    } catch (error) {
      return response.badRequest({ message: 'error ', status: false })
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
          const path = './profile'
          const fileName = cuid() + '.' + profileImage.extname
          profileImage!.moveToDisk(path, {
            overwrite: true, name: fileName
          })
          let img = await Drive.getUrl('/profile' + fileName)
          const updateData = {
            image_url: img
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
