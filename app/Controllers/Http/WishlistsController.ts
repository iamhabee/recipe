import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Wishlist from 'App/Models/Wishlist'
import { getUserAuth } from "../Traits/auth"
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default class WishlistsController {
  public async create({ request, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { description, title } = request.body()
        let img
        const image = request.file('image')
        if (image) {
          const path = './images/wishlist'
          const fileName = cuid() + '.' + image.extname
          image!.moveToDisk(path, {
            overwrite: true, name: fileName
          })
          img = await Drive.getUrl('images/wishlist' + fileName)
        }
        await Wishlist.create({ description, image: img, title })
        return response.created({ status: true, message: "Wishlist created successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async show({ response }: HttpContextContract) {
    try {
      const data = await Wishlist.all()
      return response.created({ data, status: true, message: "Wishlists fetched successful" })
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async single({ response, params }: HttpContextContract) {
    try {
      const { id } = params
      const data = await Wishlist.find(id)
      return response.created({ data, status: true, message: "Wishlist fetched successful" })
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async pick({ response, params }: HttpContextContract) {
    try {
      const { id } = params
      const data: any = await Wishlist.find(id)
      if (data.status === "OPENED") {
        data.people = data?.people + 1
        data.save()
        return response.created({ status: true, message: "Thanks for picking, God bless you" })
      } else {
        return response.created({ status: false, message: "Am so sorry this wish has been fulfilled" })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async close({ response, params, auth }: HttpContextContract) {
    try {
      const authData = await getUserAuth(auth)
      if (authData) {
        const { id } = params
        const data: any = await Wishlist.find(id)
        data.status = "CLOSED"
        data.save()
        return response.created({ data, status: true, message: "Wishlists closed successful" })
      } else {
        return response.created({ status: false, message: "user log in expired" })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      const authData = await getUserAuth(auth)
      if (authData) {
        const { description, title, id } = request.body()
        const data: any = await Wishlist.find(id)
        const image = request.file('image')
        if (image) {
          const path = './images/wishlist'
          const fileName = cuid() + '.' + image.extname
          image!.moveToDisk(path, {
            overwrite: true, name: fileName
          })
          data.image = await Drive.getUrl('images/wishlist' + fileName)
        }
        data.title = title
        data.description = description
        data.save()
        return response.created({ status: true, message: "Wishlist updated successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async delete({ params, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { id } = params
        const data = await Wishlist.find(id)
        data?.delete()
        return response.created({ status: true, message: "Wishlist deleted successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }
}
