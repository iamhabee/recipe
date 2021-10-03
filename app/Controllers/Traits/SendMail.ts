// import Mail from '@ioc:Adonis/Addons/Mail'

import Mail from "@ioc:Adonis/Addons/Mail"
import Otp from "App/Models/Otp"


export const sendMail = async (data: any) => {
  // send mail 
  return await Mail.send
    ((message) => {
      message
        .from(data.from)
        .to(data.to)
        .subject(data.subject)
        .htmlView(data.template, data.params)
    })
}

export const sendOtp = async (user_id, randomNumber, action) => {
  // search if user has previous otp
  const otp = await Otp.findBy('user_id', user_id)
  if (otp) {
    otp.otp = randomNumber
    return await otp.save()
  } else {
    if (action === "resend") {
      return
    } else {
      return await Otp.create({ user_id, otp: randomNumber });
    }
  }
}

export const verifyCode = async (user_id, code) => {
  const otp = await Otp.findByOrFail('user_id', user_id)
  if (otp.otp === Number(code)) {
    await otp.delete()
    return true
  } else {
    return false
  }
}