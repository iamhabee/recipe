import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Work from 'App/Models/Work'
import { getUserAuth } from '../Traits/auth'
import Drive from '@ioc:Adonis/Core/Drive'
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default class WorksController {
  public async create({ request, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { title, description, to, from, company_name } = request.body()
        let img
        const image = request.file('image')
        if (image) {
          const path = './works/'
          const fileName = cuid() + '.' + image.extname
          image!.moveToDisk(path, {
            overwrite: true, name: fileName
          })
          img = await Drive.getUrl('works/' + fileName)
        }
        await Work.create({ title, image: img, description, to, from, company_name })
        return response.created({ status: true, message: "Work created successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async show({ response }: HttpContextContract) {
    try {
      const data = await Work.all()
      return response.created({ data, status: true, message: "Works fetched successful" })
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async single({ response, params }: HttpContextContract) {
    try {
      const { id } = params
      const data = await Work.find(id)
      return response.created({ data, status: true, message: "Works fetched successful" })
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const authData = await getUserAuth(auth)
    try {
      if (authData) {
        const { title, description, to, from, company_name, id } = request.body()
        const data: any = await Work.find(id)
        const image = request.file('image')
        if (image) {
          const path = './works/'
          const fileName = cuid() + '.' + image.extname
          image!.moveToDisk(path, {
            overwrite: true, name: fileName
          })
          data.image = await Drive.getUrl('works/' + fileName)
        }
        data.title = title
        data.description = description
        data.to = to
        data.from = from
        data.company_name = company_name
        data.save()
        return response.created({ status: true, message: "Work updated successful" })
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
        const data = await Work.find(id)
        data?.delete()
        return response.created({ status: true, message: "Work deleted successful" })
      } else {
        return response.unauthorized({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ status: false, message: "error occured" })
    }
  }
}
