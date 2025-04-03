import { Response } from "express"
import { IPaginationQuery, IReqUser } from "../utils/interfaces"
import categoryModel, { categoryDAO } from "../models/category.model"
import response from "../utils/response"

export default {
     async create(req: IReqUser, res: Response){
          try {
               await categoryDAO.validate(req.body)
               const result = await categoryModel.create(req.body)

               response.success(res, result, 'Success create category')

          } catch(error) {
               response.error(res, error, 'Failed create category')
          }
     },
     async findAll(req: IReqUser, res: Response){
          const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery;

          try {
               const query = {}

               if (search) {
                    Object.assign(query, {
                         $or: [
                         { name: { $regex: search, $options: "i" }},
                         { description: { $regex: search, $options: "i" }},
                         ],
                    });
               }

               const result =  await categoryModel.find(query)
                              .limit(limit)
                              .skip((page - 1) * limit)
                              .sort({createdAt: -1})
                              .exec()
               
               const count = await categoryModel.countDocuments(query)

               response.pagination(
                    res, 
                    result, 
                    {
                         total: count,
                         totalPages: Math.ceil(count / limit),
                         current: page
                    }, 
                    "Success find all category"
               )

          } catch(error) {
               response.error(res, error, 'Failed findAll category')
          }
     },
     async findOne(req: IReqUser, res: Response){
          try {
               const { id } = req.params
               
               const result = await categoryModel.findById(id)

               response.success(res, result, "Success find one category")
          } catch(error) {
               response.error(res, error, 'Failed findOne category')
          }
     },
     async update(req: IReqUser, res: Response){
           try {
               const { id } = req.params
               const result = await categoryModel.findByIdAndUpdate(id, req.body, {
                    new: true
               })

               response.success(res, result, "Success update category")

          } catch(error) {
               response.error(res, error, 'Failed update category')
          }
     },
     async remove(req: IReqUser, res: Response){
           try {
               const { id } = req.params
               const result = await categoryModel.findByIdAndDelete(id)

               response.success(res, result, 'Success remove category')

          } catch(error) {
               response.error(res, error, 'Failed remove category')
          }
     },
}