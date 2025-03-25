import { Request, Response } from "express"
import * as Yup from 'yup'

import UserModel from "../models/user.model"
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middleware/auth.middleware";

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
          /** 
               #swagger.tags = ['Auth']
               #swagger.requestBody = {
                    required: true,
                    schema: {$ref: "#/components/schemas/RegisterRequest"}
               }
          */
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

               res.status(201).json({
                    code: 0,
                    message: "Success Registration",
                    data: result
               })

          } catch (error) {
               const err = error as unknown as Error
               res.status(500).json({
                    message: err.message,
                    data: null
               })
          }
     },

     async login(req: Request, res: Response) {
          /** 
               #swagger.tags = ['Auth']
               #swagger.requestBody = {
                    required: true,
                    schema: {$ref: "#/components/schemas/LoginRequest"}
               }
          */
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
                    return res.status(403).json({
                         message: 'user not found',
                         data: null
                    })
               }

               // validasi password
               const validatePassword: boolean = encrypt(password) === userByIdentifier.password

               if(!validatePassword) {
                     return res.status(403).json({
                         message: 'user not found',
                         data: null
                    })
               }

               // Generate Token JWT
               const token = generateToken({
                    id: userByIdentifier._id,
                    role: userByIdentifier.role
               })

               return res.status(200).json({
                    code: 0,
                    message: "Login Successful",
                    data: token
               })


          } catch (error) {
               const err = error as unknown as Error
               res.status(500).json({
                    message: err.message,
                    data: null
               })
          }
     },

     async me(req: IReqUser, res: Response){
          /**
               #swagger.tags = ['Auth']
               #swagger.security = [{
                    "bearerAuth": []
               }]
          */
          try {
               const user = req.user;
               const result = await UserModel.findById(user?.id)

               res.status(200).json({
                    message: "Success get user",
                    data: result
               })
          } catch (error) {
               const err = error as unknown as Error
               res.status(400).json({
                    message: err.message,
                    data: null
               })
          }
     },

     async activation(req: Request, res: Response){
          /** 
               #swagger.tags = ['Auth']
               #swagger.requestBody = {
                    required: true,
                    schema: {$ref: "#/components/schemas/ActivationRequest"}
               }
          */
          try {
               const { code } = req.body as { code: string }

               const user = await UserModel.findOneAndUpdate(
                    {activationCode: code},
                    {isActive: true},
                    {new: true}
               )

               res.status(200).json({
                    message: "User Successfully Activated",
                    data: user
               })
          } catch (error){
               const err = error as unknown as Error
               res.status(400).json({
                    message: err.message,
                    data: null
               })
          }
     }
}