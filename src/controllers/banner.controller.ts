import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import BannerModel, { bannerDAO, TypeBanner } from "../models/banner.model";
import { FilterQuery } from "mongoose";

export default {
     async create(req: IReqUser, res: Response){
          try {
               await bannerDAO.validate(req.body)
               const result = await BannerModel.create(req.body)
               response.success(res, result, 'Success create a banner')
          } catch (error) {
                response.error(res, error, "failed to create a banner")
          }
     },
     async findAll(req: IReqUser, res: Response){
          try {
             const {limit = 10, page = 1, search} = req.query as unknown as IPaginationQuery
             const query: FilterQuery<TypeBanner> = {}

             if(search) {
                    Object.assign(query, {
                         ...query,
                         $text: {
                              $search: search
                         }
                    })
               }

               const result = await BannerModel.find(query)
                              .limit(limit)
                              .skip((page - 1) * limit)
                              .sort({createdAt: -1})
                              .exec()

               const count = await BannerModel.countDocuments(query)

               response.pagination(
                    res,
                    result,
                    {
                         current: page,
                         total: count,
                         totalPages: Math.ceil(count / limit)
                    },
                    "Success get all banner"
               )

               
          } catch (error) {
                response.error(res, error, "failed to get all banner")
          }
     },
     async findOne(req: IReqUser, res: Response){
          try {

               const { id } = req.params
               const result = await BannerModel.findById(id)
               response.success(res, result, "Success find a banner")
             
          } catch (error) {
                response.error(res, error, "failed to get a banner")
          }
     },
     async update(req: IReqUser, res: Response){
          try {
               const { id } = req.params
               const result = await BannerModel.findByIdAndUpdate(id, req.body, {
                    new: true
               })

               response.success(res, result, "Success update a banner")
             
          } catch (error) {
                response.error(res, error, "failed to update a banner")
          }
     },
     async remove(req: IReqUser, res: Response){
          try {
               const { id } = req.params
               const result = await BannerModel.findByIdAndDelete(id)
               response.success(res, result, "Success remove a banner")
             
          } catch (error) {
                response.error(res, error, "failed to remove a banner")
          }
     },
}