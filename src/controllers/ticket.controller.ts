import { Request, Response } from "express";
import response from "../utils/response";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import TicketModel, { ticketDAO, TypeTicket } from "../models/ticket.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
     async create(req: IReqUser, res: Response) {
          try {
               await ticketDAO.validate(req.body)
               const result = await TicketModel.create(req.body)
               response.success(res, result, 'Success create a ticket')
          } catch (error) {
               response.error(res, error, "failed to create a ticket")
          }
     },

     async findAll(req: IReqUser, res: Response) {
          try {
               const {limit = 10, page = 1, search} = req.query as unknown as IPaginationQuery
               const query: FilterQuery<TypeTicket> = {}

               if(search) {
                    Object.assign(query, {
                         ...query,
                         $text: {
                              $search: search
                         }
                    })
               }

               const result = await TicketModel.find(query)
                              .populate('events')
                              .limit(limit)
                              .skip((page - 1) * limit)
                              .sort({createdAt: -1})
                              .exec()
               
               const count = await TicketModel.countDocuments(query)

               response.pagination(
                    res,
                    result,
                    {
                         current: page,
                         total: count,
                         totalPages: Math.ceil(count / limit)
                    },
                    "Success get all ticket"
               )
               
          } catch (error) {
               response.error(res, error, "failed to find ticket")
          }
     },

     async findOne(req: IReqUser, res: Response) {
          try {
               const { id } = req.params
               const result = await TicketModel.findById(id)
               response.success(res, result, "Success find a ticket")

          } catch (error) {
               response.error(res, error, "failed to find a ticket")
          }
     },
     async update(req: IReqUser, res: Response) {
          try {
               const { id } = req.params
               const result = await TicketModel.findByIdAndUpdate(id, req.body, {
                    new: true
               })

               response.success(res, result, "Success update an event")

          } catch (error) {
               response.error(res, error, "failed to update a ticket")
          }
     },
     async remove(req: IReqUser, res: Response) {
          try {
               const { id } = req.params
               const result = await TicketModel.findByIdAndDelete(id)
               response.success(res, result, "Success remove an event")
          } catch (error) {
               response.error(res, error, "failed to remove a ticket")
          }
     },
     async findAllByEvent(req: IReqUser, res: Response) {
          try {
               const { eventId } = req.params

               if(!isValidObjectId(eventId)){
                    return response.error(res, null, "ticket is not found")
               }

               const result = await TicketModel.find({events: eventId}).exec()
               response.success(res, result, "Success find all ticket by events")
          } catch (error) {
               response.error(res, error, "failed to find a ticket by an event")
          }
     },
}