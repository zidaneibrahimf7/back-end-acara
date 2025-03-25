
import swaggerAutogen from "swagger-autogen";

const doc = {
     info: {
          version: "v0.0.1",
          title: "Documentation API ACARA",
          description: "Documentation for ACARA API"
     },
     servers: [
          {
               url: "http://localhost:3000/api",
               description: "Local Server"
          },
          {
               url: "https://back-end-acara-sable.vercel.app/api",
               description: "Deploy Server"
          }
     ],
     components: {
          securitySchemes: {
               bearerAuth: {
                    type: "http",
                    scheme: 'bearer'
               }
          },
          schemas: {
               LoginRequest: {
                    identifier: "zidaneibrhmfdl7",
                    password: "Ibrhmfdl_1"
               },
               RegisterRequest: {
                    fullName: "Zidane Ibrahim Fadela",
                    username: "zidaneibrhmfdl7",
                    email: "zidaneibrhmfdl7@gmail.com",
                    password: "Ibrhmfdl_1",
                    confirmPassword: "Ibrhmfdl_1"
               },
               ActivationRequest: {
                    code: "abcdefg"
               }
          },
     }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ["../routes/api.ts"]

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)