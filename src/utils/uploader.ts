import {v2 as cloudinary} from 'cloudinary'
import {
     CLOUDINARY_API_KEY,
     CLOUDINARY_API_SECRET,
     CLOUDINARY_CLOUD_NAME    
} from './env'

cloudinary.config({
     cloud_name: CLOUDINARY_CLOUD_NAME,
     api_key: CLOUDINARY_API_KEY,
     api_secret: CLOUDINARY_API_SECRET
})

const toDataUrl = (file: Express.Multer.File) => {
     const base64 = Buffer.from(file.buffer).toString("base64")
     const dataURL = `data:${file.mimetype};base64,${base64}`

     return dataURL
}

const getPublicIdFromFIleUrl = (fileUrl: string) => {
     const fileNameUsingSubstring = fileUrl.substring(
          fileUrl.lastIndexOf('/') + 1
     );

     const publicId = fileNameUsingSubstring.substring(
          0, 
          fileNameUsingSubstring.lastIndexOf(".")
     )

     return publicId
}

export default {
     async uploadSingle(file: Express.Multer.File) {
          const fileDataUrl = toDataUrl(file)
          const result = await cloudinary.uploader.upload(fileDataUrl, {
               resource_type: "auto"
          })

          return result
     },
     async uploadMultiple(files: Express.Multer.File[]) {
          const uploadBatch = files.map((item) => {
               const result = this.uploadSingle(item)

               return result
          })

          const results = await Promise.all(uploadBatch)
          return results
     },


     async remove(fileUrl: string) {
          const publicId = getPublicIdFromFIleUrl(fileUrl)
          const result = await cloudinary.uploader.destroy(publicId);
          return result
     }
}