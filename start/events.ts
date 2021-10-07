/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'
import { sendMail, sendOtp } from 'App/Controllers/Traits/SendMail'

Event.on('send-otp', async (data) => {
  await sendOtp(data.id, data.otp, data.type)
})

Event.on('send-mail', async (data) => {
  await sendMail(data)
})

Event.on('mentor-mentee-request', async (data) => {
  await sendMail(data)
})