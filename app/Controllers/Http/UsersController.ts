import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import { validator } from '@ioc:Adonis/Core/Validator';
import { userSchema } from '../schema/userSchema';
import Profile from 'App/Models/Profile';
import { getUserAuth } from '../Traits/auth';


export default class UsersController {

  public async login({ auth, response, request }: HttpContextContract) {
    try {
      const email = request.input('email');
      const password = request.input('password');
      const token = await auth.use('api').attempt(email, password, { expiresIn: '7days' });
      return token
    } catch {
      return response.badRequest({ message: 'Invalid credentials' })
    }
  }

  public async register({ response, request }: HttpContextContract) {
    try {
      await request.validate({
        schema: userSchema,
        reporter: validator.reporters.api
      })
      const email = request.input('email');
      const password = request.input('password');
      const name = request.input('name');
      const user_type = request.input('user_type');
      const userData = await User.create({
        email, password, name, user_type
      });

      await Profile.create({
        user_id: userData.id,
        phone: "",
        nick_name: "",
        branch: "",
        school: "",
        class: "",
        course_of_study: "",
        qualification: "",
        no_of_children: 0,
        social_media: "",
        skills: "",
        availability_status: "",
        marital_status: "",
        post: "",
        address: "",
        sex: ""
      });
      return response.created({ data: userData, message: 'Registration successful' });
    } catch (error) {
      return response.badRequest({ message: error })
    }
  }

  // update user email
  public async updateEmail({ auth, response, request }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    if (authData) {
      const user = await User.findOrFail(authData.id)
      user.email = request.input('email')
      await user.save()
      return response.created({ status: true, message: "Email Updated successful" })
    } else {
      return response.badRequest({ message: 'user log in expired', status: false })
    }
  }

  public async changePasword({ auth, response, request }: HttpContextContract) {
    try {
      const authData = await getUserAuth(auth)
      if (authData) {
        const user = await User.findOrFail(authData.id)
        user.password = request.input('password')
        await user.save()
        return response.created({ status: true, message: "Password updated successful" })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

}
