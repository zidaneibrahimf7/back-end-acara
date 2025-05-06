import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";

import {renderMailHTML, sendMail} from '../utils/mail/mail'
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";
import { ROLES } from "../utils/constant";
// import { User } from "../utils/interfaces";

import * as Yup from "yup"

const validatePassword = Yup.string()
                         .required().min(6, 'Password must be at least 6 characters')
                         .test(
                              "at-least-one-uppercase-letter",
                              "Contains at least one uppercase letter",
                              (value) => {
                                   if (!value) return false;
                                   const regex = /^(?=.*[A-Z])/;
                                   return regex.test(value);
                              }
                         )
const validateConfirmPassword = Yup.string()
                                   .required("Please input your password confirmation")
                                   .oneOf([Yup.ref("password"), ""], "Password confirmation does not match")

export const userLoginDTO = Yup.object({
     identifier: Yup.string().required(),
     password: validatePassword
})

export const userUpdatePasswordDTO = Yup.object({
     oldPassword: validatePassword,
     password: validatePassword,
     confirmPassword: validateConfirmPassword
})

export const userDTO = Yup.object({
     fullName: Yup.string().required(),
     username: Yup.string().required(),
     email: Yup.string().required(),
     password: validatePassword,
     confirmPassword: validateConfirmPassword,
})

export type TypeUser = Yup.InferType<typeof userDTO>

export interface User extends Omit<TypeUser, "confirmPassword">{
     isActive: boolean;
     activationCode: string;
     role: string;
     profilePicture: string;
     createdAt?: string;
}

const Schema = mongoose.Schema

export const USER_MODEL_NAME = "User"

const UserSchema = new Schema<User>({
     fullName: {
          type: Schema.Types.String,
          required: true
     },
     username: {
          type: Schema.Types.String,
          required: true
     },
     email: {
          type: Schema.Types.String,
          required: true
     },
     password: {
          type: Schema.Types.String,
          required: true
     },
     role: {
          type: Schema.Types.String,
          enum: [ROLES.ADMIN, ROLES.MEMBER],
          default: ROLES.MEMBER
     },
     profilePicture: {
          type: Schema.Types.String,
          default: "user.jpg"
     },
     isActive: {
          type: Schema.Types.Boolean,
          default: false,
     },
     activationCode: {
          type: Schema.Types.String,
     },
}, {timestamps: true, versionKey: false})

// Menyimpan password dalam bentuk encrypted
UserSchema.pre('save', function(next){
     const user = this
     user.password = encrypt(user.password)
     user.activationCode = encrypt(user.id)
     next()
})

// Untuk proses mengirimkan activation to email
UserSchema.post("save", async function(doc, next){
     try {
          const user = doc
          const contentMail = await renderMailHTML("registration-success.ejs", {
               username: user.username,
               fullName: user.fullName,
               email: user.email,
               createdAt: user.createdAt,
               activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`
          });

          await sendMail({
               from: EMAIL_SMTP_USER,
               to: user.email,
               subject: "Aktivasi Akun",
               html: contentMail
          })

          next()
     } catch (error){
          console.log(error, ':error message')
     } finally {
          next()
     }
})

// Menghapus key password saat hit api LOGIN
UserSchema.methods.toJSON = function () {
     const user = this.toObject()
     delete user.password
     return user
}

const UserModel = mongoose.model(USER_MODEL_NAME, UserSchema)

export default UserModel