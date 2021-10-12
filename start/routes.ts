/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})
Route.group(() => {
  const CTR_BASE = "/App/Controllers/Http/";

  Route.group(() => {
    Route.post('/login', `${CTR_BASE}UsersController.login`)
    Route.post('/register', `${CTR_BASE}UsersController.register`)
    Route.post('/forgotPassword', `${CTR_BASE}UsersController.requestForgotPassword`)
    Route.post('/resetPassword', `${CTR_BASE}UsersController.resetPassword`)
    Route.post('/verifyEmail', `${CTR_BASE}UsersController.verifyEmail`)
    Route.post('/resendOtp', `${CTR_BASE}UsersController.resendOtp`)
  }).prefix('auth')

  Route.group(() => {
    // user profile api
    Route.get('/profile', `${CTR_BASE}ProfilesController.getCurrentUser`)
    Route.post('/profile', `${CTR_BASE}ProfilesController.updateProfile`)
    Route.put('/profilePicture', `${CTR_BASE}ProfilesController.updatePicture`)

    Route.put('/updateEmail', `${CTR_BASE}UsersController.updateEmail`)
    Route.post('/password', `${CTR_BASE}UsersController.requestChangePassword`)
    Route.post('/changePassword', `${CTR_BASE}UsersController.changePassword`)

    // azkar api
    Route.get('/azkar', `${CTR_BASE}AzkarsController.read`)
    Route.get('/azkar/:id', `${CTR_BASE}AzkarsController.readOne`)

    // branch api
    Route.get('/branch', `${CTR_BASE}BranchesController.read`)
    Route.get('/branch/:id', `${CTR_BASE}BranchesController.readOne`)

    // news api
    Route.get('/news', `${CTR_BASE}NewsController.read`)
    Route.get('/news/:id', `${CTR_BASE}NewsController.readOne`)

    // reciter api
    Route.get('/reciter', `${CTR_BASE}RecitersController.read`)
    Route.get('/reciter/:id', `${CTR_BASE}RecitersController.readOne`)

    // mentor api
    Route.get('/mentor', `${CTR_BASE}MentorsController.read`)
    Route.get('/mentor/:id', `${CTR_BASE}MentorsController.readOne`)

    // mentor / mentee
    Route.post('/acceptOrDecline', `${CTR_BASE}ClassroomsController.acceptOrDeclineRequest`) // accept / decline request by mentor/mentee
    Route.get('/request/:id', `${CTR_BASE}ClassroomsController.getRequest`) //fetch single request details
    Route.get('/myMentors', `${CTR_BASE}ClassroomsController.getMyMentor`) // fetch my mentors
    Route.get('/myMentees', `${CTR_BASE}ClassroomsController.getMyMentee`) // fetch my mentees
    Route.get('/userRequest', `${CTR_BASE}ClassroomsController.getUserRequest`) // fetch mentor / mentee request in pending

    // schedules
    Route.post('/schedule', `${CTR_BASE}ClassroomsController.scheduleClass`)
    Route.get('/schedule', `${CTR_BASE}ClassroomsController.getClassSchedules`)
    Route.get('/schedule/:id', `${CTR_BASE}ClassroomsController.getClassSchedule`)
    Route.delete('/schedule/:id', `${CTR_BASE}ClassroomsController.deleteSchedule`)
    Route.post('/sendReport', `${CTR_BASE}ClassroomsController.sendClassReport`)
    Route.post('/rate', `${CTR_BASE}ClassroomsController.rate`)
    Route.get('/updateStatus/:id/:status', `${CTR_BASE}ClassroomsController.updateSchedule`)


    Route.group(() => {
      // only admin can create update and delete branch
      Route.post('/branch', `${CTR_BASE}BranchesController.create`)
      Route.put('/branch/:id', `${CTR_BASE}BranchesController.update`)
      Route.delete('/branch/:id', `${CTR_BASE}BranchesController.delete`)

      // only admin can create update and delete news
      Route.post('/news', `${CTR_BASE}NewsController.create`)
      Route.put('/news/:id', `${CTR_BASE}NewsController.update`)
      Route.delete('/news/:id', `${CTR_BASE}NewsController.delete`)
      Route.post('/notification', `${CTR_BASE}NewsController.pushNotification`)

      // only admin can create update and delete azkar
      Route.post('/azkar', `${CTR_BASE}AzkarsController.create`)
      Route.put('/azkar/:id', `${CTR_BASE}AzkarsController.update`)
      Route.delete('/azkar/:id', `${CTR_BASE}AzkarsController.delete`)

      // only admin can create and delete reciters
      Route.post('/reciter', `${CTR_BASE}RecitersController.create`)
      Route.delete('/reciter/:id', `${CTR_BASE}RecitersController.delete`)

      // only admin can create and delete mentors
      Route.post('/mentor', `${CTR_BASE}MentorsController.create`)
      Route.delete('/mentor/:id', `${CTR_BASE}MentorsController.delete`)

      Route.post('/request', `${CTR_BASE}ClassroomsController.sendRequest`)
      Route.get('/request', `${CTR_BASE}ClassroomsController.getRequests`)

    }).middleware("admin").prefix('admin');
  }).middleware("auth:api");

}).prefix('api')