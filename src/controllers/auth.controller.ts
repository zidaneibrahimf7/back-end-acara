import { Request, Response } from "express"
import * as Yup from 'yup'

import UserModel from "../models/user.model"
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";


type TRegister = {
     fullName: string;
     username: string;
     email: string;
     password: string;
     confirmPassword: string;
}

type TLogin = {
     identifier: string;
     password: string
}

const registerValidateSchema = Yup.object({
     fullName : Yup.string().required(),
     username : Yup.string().required(),
     email    : Yup.string().email().required(),
     password : Yup.string()
               .required().min(6, 'Password must be at least 6 characters')
               .test(
                    "at-least-one-uppercase-letter",
                    "Contains at least one uppercase letter",
                    (value) => {
                         if (!value) return false;
                         const regex = /^(?=.*[A-Z])/;
                         return regex.test(value);
                    }
               ),
     confirmPassword : Yup.string()
                    .required("Please input your password confirmation")
                    .oneOf([Yup.ref("password"), ""], "Password confirmation does not match"),
})

export default {
     async register(req: Request, res: Response) {
          const { fullName, username, email, password, confirmPassword } = req.body as unknown as TRegister

          try {
               await registerValidateSchema.validate({
                    fullName,
                    username,
                    email,
                    password,
                    confirmPassword
               })

               const result = await UserModel.create({
                    fullName,
                    username,
                    email,
                    password
               })

               response.success(res, result, "Success Registration")
               // res.status(201).json({
               //      code: 0,
               //      message: "Success Registration",
               //      data: result
               // })

          } catch (error) {
               const err = error as unknown as Error
               response.error(res, error, 'Failed registration')
               // res.status(500).json({
               //      message: err.message,
               //      data: null
               // })
          }
     },

     async login(req: Request, res: Response) {
          const {identifier, password} = req.body as unknown as TLogin
          try {
               // Ambil data user berdasarkan "identifier" -> email dan username (jadi akibatnya bisa menuliskan email atau usernamenya)
               const userByIdentifier = await UserModel.findOne({
                    $or: [ //validasi untuk dua data
                              { email: identifier},
                              { username: identifier},
                         ],
                         isActive: true //mengecek apakah sudah diaktivasi akunnya!
                    })

               if(!userByIdentifier){
                   return response.unauthorized(res, 'User not found')
               }

               // validasi password
               const validatePassword: boolean = encrypt(password) === userByIdentifier.password

               if(!validatePassword) {
                    return response.unauthorized(res, 'User not found')
               }

               // Generate Token JWT
               const token = generateToken({
                    id: userByIdentifier._id,
                    role: userByIdentifier.role
               })

               return response.success(res, token, 'Login successfull')
               // return res.status(200).json({
               //      code: 0,
               //      message: "Login Successful",
               //      data: token
               // })


          } catch (error) {
               const err = error as unknown as Error
               response.error(res, error, err.message)
          }
     },

     async me(req: IReqUser, res: Response){
          try {
               const user = req.user;
               const result = await UserModel.findById(user?.id)

               return response.success(res, result, 'Success get user')

          } catch (error) {
               const err = error as unknown as Error
               response.error(res, error, err.message)
          }
     },

     async activation(req: Request, res: Response){
          try {
               const { code } = req.body as { code: string }

               const user = await UserModel.findOneAndUpdate(
                    { activationCode: code },
                    { isActive: true },
                    { new: true }
               )

               return response.success(res, user, 'User successfully activated')

          } catch (error){
               const err = error as unknown as Error
               response.error(res, error, err.message)
          }
     }
}