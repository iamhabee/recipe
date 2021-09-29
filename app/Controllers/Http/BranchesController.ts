import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Branch from 'App/Models/Branch';

import { getUserAuth } from "../Traits/auth"

export default class BranchesController {

  // create branch 
  public async create({ auth, response, request }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const branch_name = request.input('branch_name');
        const branch_address = request.input('branch_address');
        const user_id = request.input('user_id');
        const no_of_members = request.input('no_of_members');

        // crete new azkar
        const branchData = await Branch.create({
          branch_name, branch_address, user_id, no_of_members
        });
        return response.created({ status: true, message: "Branch created Successfully", data: branchData })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch all branch 
  public async read({ auth, response }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const branchdata = await Branch.all()
        return response.created({ status: true, message: "branches fetched Successfully", data: branchdata })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // fetch single branch 
  public async readOne({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const branchdata = await Branch.find(params.id)
        return response.created({ status: true, message: "Branch fetched Successfully", data: branchdata })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // delete branch 
  public async delete({ auth, response, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        const branch = await Branch.findOrFail(params.id)
        await branch.delete()
        return response.created({ status: true, message: "Branch deleted Successfully", })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

  // update branch 
  public async update({ auth, response, request, params }: HttpContextContract) {
    try {
      // get user authentication
      const authData = await getUserAuth(auth)
      if (authData) {
        // find branch to be updated in branch table
        const branch = await Branch.findOrFail(params.id)

        // persist the data 
        branch.no_of_members = request.input('no_of_members')
        branch.branch_address = request.input('branch_address')
        branch.branch_name = request.input('branch_name')
        branch.user_id = request.input('user_id')

        // update azkar row in table
        const branchData = await branch.save()

        return response.created({ status: true, message: "Branch updated Successfully", data: branchData })
      } else {
        return response.badRequest({ message: 'user log in expired', status: false })
      }
    } catch (error) {
      return response.badRequest({ message: error, status: false })
    }
  }

}
