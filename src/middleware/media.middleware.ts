import multer from "multer"

const storage = multer.memoryStorage();
const upload = multer({
     storage
})



export default {
     single(fileName: string){
          return upload.single(fileName);
     },
     multiple(fileName: string){
          return upload.array(fileName);
     }
}