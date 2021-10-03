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

    }).middleware("admin:api");
  }).middleware("auth:api");

}).prefix('api')