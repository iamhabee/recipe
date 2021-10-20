import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import Hash from '@ioc:Adonis/Core/Hash'
import { validator } from '@ioc:Adonis/Core/Validator';
import { userSchema } from '../schema/userSchema';
import { getUserAuth } from '../Traits/auth';


export default class UsersController {

  public async login({ auth, response, request }: HttpContextContract) {
    try {
      const { email, password } = request.body();
      const data = await auth.use('api').attempt(email, password, { expiresIn: '7days' });
      return response.created({ message: 'Login successful', data, status: true })
    } catch (err) {
      return response.badRequest({ message: 'Invalid credentials', status: false })
    }
  }

  public async register({ response, request }: HttpContextContract) {
    try {
      await request.validate({
        schema: userSchema,
        reporter: validator.reporters.api
      })
      const { email, password, first_name, last_name, phone_number, user_type } = request.body();
      const userData = await User.create({
        email, password, first_name, last_name, phone_number, user_type
      });
      return response.created({ data: userData, message: 'Registration successful', status: true });
    } catch (error) {
      return response.badRequest({ message: error })
    }
  }

  // update user name and email
  // public async updateEmail({ auth, response, request }: HttpContextContract) {
  //   try {
  //     // get user auth
  //     const authData = await getUserAuth(auth)
  //     if (authData) {
  //       // find user
  //       const user = await User.findOrFail(authData.id)
  //       let email = authData.email
  //       // persit the data
  //       user.phone_number = request.input('phone_number')
  //       user.first_name = request.input('first_name')
  //       user.last_name = request.input('last_name')
  //       if (request.input('email')) {
  //         await request.validate({
  //           schema: emailUpdateSchema,
  //           reporter: validator.reporters.api
  //         })
  //         user.email = request.input('email')
  //         email = request.input('email')
  //       }
  //       // update user database
  //       await user.save()
  //       return response.created({ status: true, message: "Profile Updated successful" })
  //     } else {
  //       return response.unauthorized({ message: 'user log in expired', status: false })
  //     }
  //   } catch (message) {
  //     return response.badRequest({ message, status: false })
  //   }
  // }

  // request to change password
  public async requestChangePassword({ auth, response, request }: HttpContextContract) {
    try {
      // get user auth
      const authData = await getUserAuth(auth)
      if (authData) {
        // send otp to user email and phone number
        const password = request.input('password')
        const oldPassword = authData.password
        if (await Hash.verify(oldPassword, password)) {
          // verified
          return response.created({ status: true, message: "A one time password has been send to your mail to change your password" })
        } else {
          return response.created({ status: true, message: "Wrong user password" })
        }
      } else {
        return response.unauthorized({ status: false, message: "User log in expired" })
      }
    } catch (message) {
      return response.badRequest({ status: false, message })
    }
  }

  // change password 
  public async changePassword({ auth, response, request }: HttpContextContract) {
    try {
      // get user auth 
      const authData = await getUserAuth(auth)
      if (authData) {
        // find user
        const user = await User.findOrFail(authData.id)
        const password = request.input('password')
        // check otp
        // persit the data
        user.password = password
        // update user database
        await user.save()
        return response.created({ status: true, message: "User password changed" })

      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (message) {
      return response.badRequest({ message, status: false })
    }
  }

  // no auth require to request forgot password
  public async requestForgotPassword({ response, request }: HttpContextContract) {
    try {
      // send otp to user email and phone number
      const email = request.input('email')
      const user = await User.findBy('email', email)
      if (user) {
        // verified
        return response.created({ status: true, message: "A one time password has been send to your mail to reset your password" })
      } else {
        return response.created({ status: false, message: "User with the given email does not exist" })
      }
    } catch (message) {
      return response.badRequest({ status: false, message })
    }
  }

  // no auth require to reset password
  public async resetPassword({ response, request }: HttpContextContract) {
    try {
      // find user
      const password = request.input('password')
      const email = request.input('email')
      // get user with email
      const user: any = await User.findBy('email', email)
      // check otp
      // persit the data
      user.password = password
      // update user database
      await user?.save()
      return response.created({ status: true, message: "User password reset" })

    } catch (message) {
      return response.badRequest({ message, status: false })
    }
  }
}
