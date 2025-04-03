import { NextFunction, Request, Response } from "express";
import { getUserData } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";


export default (req:Request, res:Response, next:NextFunction) => {
     const authorization = req.headers?.authorization

     if(!authorization){
          return response.unauthorized(res, 'unauthorized')
     }

     const [prefix, token] = authorization.split(" ")

     if(!(prefix === 'Bearer' && token)) {
          return response.unauthorized(res, 'unauthorized')
     }

     const user = getUserData(token)

     if(!user){
          return response.unauthorized(res, 'unauthorized')
     }

     (req as IReqUser).user = user

     next()
}