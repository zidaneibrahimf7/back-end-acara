
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
               },
               CreateCategoryRequest: {
                    name: "",
                    description: "",
                    icon: ""
               },
               CreateEventRequest: {
                    name: "Acara - 1 - name",
                    banner: "https://res.cloudinary.com/dnmhujrwe/image/upload/v1743737059/o0qmwyqcl0itufx4ekqg.jpg",
                    category: "67ef52cf63f45b26e5743b95",
                    description: "Acara - description",
                    startDate: "2024-12-16 10:45:00",
                    endDate: "2024-12-16 12:45:00",
                    location: {
                         region: 3213180003,
                         coordinates: [6.6, 10.10]
                    },
                    isOnline: false,
                    isFeatured: true
               },
               RemoveMedia: {
                    fileUrl: ""
               }

          },
     }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ["../routes/api.ts"]

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)