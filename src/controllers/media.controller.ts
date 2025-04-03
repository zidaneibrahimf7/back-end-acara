import { Response } from "express"
import { IReqUser } from '../utils/interfaces'
import uploader from "../utils/uploader"
import response from "../utils/response"


export default {
     async single(req: IReqUser, res: Response) {
          if(!req.file){
               return response.error(res, null, "File not found")
               // return res.status(400).json({
               //      data: null,
               //      message: "File is not exits"
               // });
          }

          try {
               const result = await uploader.uploadSingle(req.file as Express.Multer.File)
               return response.success(res, result, "Success upload a file")
               // res.status(200).json({
               //      data: result,
               //      message: "Success upload a file"
               // })
          } catch (error) {
               console.log('Error Message:', error)
               response.error(res, null, 'Failed upload a file')
          }
     },
     async multiple(req: IReqUser, res: Response){
           if(!req.files){
               return response.error(res, null, "File not found")
          }

          try {
               const result = await uploader.uploadMultiple(req.files as Express.Multer.File[])
               return response.success(res, result, "Success upload files")
          } catch (error) {
               console.log('Error Message:', error)
               response.error(res, null, 'Failed upload files')
          }
     },
     async remove(req: IReqUser, res: Response){
          try {
               const { fileUrl } = req.body as { fileUrl: string}

               const result = await uploader.remove(fileUrl)

               return response.success(res, result, "Success delete file")
               
               // res.status(200).json({
               //      data: result,
               //      message: "Success delete file"
               // })
          } catch {
               response.error(res, null, 'Failed delete file')
          }
     }
}