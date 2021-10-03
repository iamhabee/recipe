import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import Hash from '@ioc:Adonis/Core/Hash'
import { validator } from '@ioc:Adonis/Core/Validator';
import Event from '@ioc:Adonis/Core/Event'
import { emailUpdateSchema, userSchema } from '../schema/userSchema';
import Profile from 'App/Models/Profile';
import { getUserAuth } from '../Traits/auth';
import { sendOtp, verifyCode } from '../Traits/SendMail';


export default class UsersController {

  public async login({ auth, response, request }: HttpContextContract) {
    try {
      const email = request.input('email');
      const password = request.input('password');
      const user = await User.findBy('email', email)
      if (user?.verify_email) {
        const data = await auth.use('api').attempt(email, password, { expiresIn: '7days' });
        return response.created({ message: 'Login successful', data })
      } else {
        return response.created({ message: 'Email not verify' })
      }
    } catch {
      return response.badRequest({ message: 'Invalid credentials', status: false })
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
      const first_name = request.input('first_name');
      const last_name = request.input('last_name');
      const phone_number = request.input('phone_number');
      const user_type = request.input('user_type');
      const userData = await User.create({
        email, password, first_name, last_name, phone_number, user_type
      });
      await Profile.create({
        user_id: userData.id,
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
      const otp = (Math.floor(Math.random() * 1000000) + 1000000).toString().substring(1);
      const data = this.getMailData(email, "Verify your email", { fullName: `${first_name} ${last_name}` }, otp)
      Event.emit('send-mail', data)
      Event.emit('send-otp', { id: userData.id, otp, type: "change" })
      return response.created({ data: userData, message: 'Registration successful' });
    } catch (error) {
      return response.badRequest({ message: error })
    }
  }


  // update user name and email
  public async updateEmail({ auth, response, request }: HttpContextContract) {
    try {
      // get user auth
      const authData = await getUserAuth(auth)
      if (authData) {
        // find user
        const user = await User.findOrFail(authData.id)
        let email = authData.email
        // persit the data
        user.phone_number = request.input('phone_number')
        user.first_name = request.input('first_name')
        user.last_name = request.input('last_name')
        if (request.input('email')) {
          await request.validate({
            schema: emailUpdateSchema,
            reporter: validator.reporters.api
          })
          user.email = request.input('email')
          email = request.input('email')
        }
        // update user database
        await user.save()
        // const otp = (Math.floor(Math.random() * 1000000) + 1000000).toString().substring(1);
        const data = this.getMailData(email, "User data update", { fullName: `${user.first_name} ${user.last_name}` }, "")
        Event.emit('send-mail', data)
        Event.emit('send-otp', { id: authData.id, otp: "", type: "change" })
        return response.created({ status: true, message: "Profile Updated successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (message) {
      return response.badRequest({ message, status: false })
    }
  }

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

          const otp = (Math.floor(Math.random() * 1000000) + 1000000).toString().substring(1);
          const data = this.getMailData(authData.email, "Change password request", { fullName: `${authData.first_name} ${authData.last_name}` }, otp)
          Event.emit('send-mail', data)
          Event.emit('send-otp', { id: authData.id, otp, type: "change" })
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
        const code = request.input('code')
        const password = request.input('password')
        // check otp
        if (await verifyCode(authData.id, code)) {
          // persit the data
          user.password = password
          // update user database
          await user.save()
          const data = this.getMailData(user.email, "Password changed notifiction", { fullName: `${user.first_name} ${user.last_name}` }, "")
          Event.emit('send-mail', data)
          Event.emit('send-otp', { id: user.id, otp: "", type: "change" })
          return response.created({ status: true, message: "User password changed" })
        } else {
          return response.created({ status: false, message: "incorrect Otp" })
        }
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
        const otp = (Math.floor(Math.random() * 1000000) + 1000000).toString().substring(1);
        const data = this.getMailData(email, "Request forgot password", { fullName: `${user.first_name} ${user.last_name}` }, otp)
        Event.emit('send-mail', data)
        Event.emit('send-otp', { id: user.id, otp, type: "forgot" })
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
      const code = request.input('code')
      const password = request.input('password')
      const email = request.input('email')
      // get user with email
      const user: any = await User.findBy('email', email)
      // check otp
      if (await verifyCode(user?.id, code)) {
        // persit the data
        user.password = password
        // update user database
        await user?.save()
        // const otp = (Math.floor(Math.random() * 1000000) + 1000000).toString().substring(1);
        const data = this.getMailData(email, "Password reset notification", { fullName: `${user.first_name} ${user.last_name}` }, "")
        Event.emit('send-mail', data)
        Event.emit('send-otp', { id: user.id, otp: "", type: "forgot" })
        return response.created({ status: true, message: "User password reset" })
      } else {
        return response.created({ status: false, message: "incorrect Otp" })
      }
    } catch (message) {
      return response.badRequest({ message, status: false })
    }
  }

  // no auth require to verify email
  public async verifyEmail({ response, request }: HttpContextContract) {
    try {
      // find user
      const code = request.input('code')
      const email = request.input('email')
      // get user with email
      const user: any = await User.findBy('email', email)
      // check otp
      if (await verifyCode(user?.id, code)) {
        // persit the data
        user.verify_email = true
        // update user database
        await user?.save()
        // const otp = (Math.floor(Math.random() * 1000000) + 1000000).toString().substring(1);
        const data = this.getMailData(email, "Email verified notifiction", { fullName: `${user.first_name} ${user.last_name}` }, "otp")
        Event.emit('send-mail', data)
        Event.emit('send-otp', { id: user.id, otp: "", type: "change" })
        return response.created({ status: true, message: "Email verify successful" })
      } else {
        return response.created({ status: false, message: "incorrect Otp" })
      }
    } catch (message) {
      return response.badRequest({ message, status: false })
    }
  }

  // no auth require to resend otp
  public async resendOtp({ response, request }: HttpContextContract) {
    try {
      // find user
      const email = request.input('email')
      // get user with email
      const user: any = await User.findBy('email', email)
      if (user) {
        const otp = (Math.floor(Math.random() * 1000000) + 1000000).toString().substring(1);
        const data = this.getMailData(email, "Token resend", { fullName: `${user.first_name} ${user.last_name}` }, otp)
        const res = await sendOtp(user.id, otp, "resend")
        if (res) {
          Event.emit('send-mail', data)
          return response.created({ status: true, message: "A one time password has been resend to your mail" })
        } else {
          return response.created({ status: false, message: "Please request for new code" })
        }
      } else {
        return response.created({ status: false, message: "User with the given email does not exist" })
      }
    } catch (message) {
      return response.badRequest({ message, status: false })
    }
  }

  getMailData = (email, subject, user, otp) => {
    return {
      template: 'emails/welcome',
      params: { user, otp },
      from: "toykampage1000@gmail.com",
      to: email,
      subject
    }
  }
}
