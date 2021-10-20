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
  }).prefix('auth')

  Route.get('/profile', `${CTR_BASE}ProfilesController.getCurrentUser`)
  Route.get('/event', `${CTR_BASE}EventsController.show`)
  Route.get('/event/:id', `${CTR_BASE}EventsController.single`)
  Route.get('/eductaion', `${CTR_BASE}EducationsController.show`)
  Route.get('/eductaion/:id', `${CTR_BASE}EducationsController.single`)
  Route.get('/family', `${CTR_BASE}FamiliesController.show`)
  Route.get('/family/:id', `${CTR_BASE}FamiliesController.single`)
  Route.get('/hobby', `${CTR_BASE}HobbiesController.show`)
  Route.get('/hobby/:id', `${CTR_BASE}HobbiesController.single`)
  Route.get('/wishlist', `${CTR_BASE}WishlistsController.show`)
  Route.get('/wishlist/:id', `${CTR_BASE}WishlistsController.single`)
  Route.get('/work', `${CTR_BASE}WorksController.show`)
  Route.get('/work/:id', `${CTR_BASE}WorksController.single`)

  Route.group(() => {
    // user profile api
    Route.put('/profile', `${CTR_BASE}ProfilesController.updateProfile`)

    // events and places
    Route.put('/event', `${CTR_BASE}EventsController.update`)
    Route.post('/event', `${CTR_BASE}EventsController.create`)
    Route.delete('/event', `${CTR_BASE}EventsController.delete`)

    // Educations
    Route.put('/eductaion', `${CTR_BASE}EducationsController.update`)
    Route.post('/eductaion', `${CTR_BASE}EducationsController.create`)
    Route.delete('/eductaion', `${CTR_BASE}EducationsController.delete`)

    // fmilies
    Route.put('/family', `${CTR_BASE}FamiliesController.update`)
    Route.post('/family', `${CTR_BASE}FamiliesController.create`)
    Route.delete('/family', `${CTR_BASE}FamiliesController.delete`)

    // hobbies
    Route.put('/hobby', `${CTR_BASE}HobbiesController.update`)
    Route.post('/hobby', `${CTR_BASE}HobbiesController.create`)
    Route.delete('/hobby', `${CTR_BASE}HobbiesController.delete`)

    // wishlist
    Route.put('/wishlist', `${CTR_BASE}WishlistsController.update`)
    Route.post('/wishlist', `${CTR_BASE}WishlistsController.create`)
    Route.delete('/wishlist', `${CTR_BASE}WishlistsController.delete`)

    // works
    Route.put('/work', `${CTR_BASE}WorksController.update`)
    Route.post('/work', `${CTR_BASE}WorksController.create`)
    Route.delete('/work', `${CTR_BASE}WorksController.delete`)

  }).middleware("auth:api");

}).prefix('api/haneefah')