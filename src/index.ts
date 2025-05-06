import express from 'express'
import router from './routes/api'
import bodyParser from 'body-parser'
import db from './utils/database'
import docs from './docs/route'
import cors from 'cors'
import errorMiddleware from './middleware/error.middleware'

async function init(){
     try {

          const database = await db()
          console.log('Database status:', database)

          const app = express()

          const PORT = 3000

          app.use(cors())
          app.use(bodyParser.json())
          // app.use(express.json())
          // app.use(express.urlencoded({ extended: true }));

          app.get('/', (req, res) => {
               res.status(200).json({
                    message: "Server is running",
                    data: null
               })
          })
          app.use('/api', router)
          docs(app)

          // Urutan perlu diperhatikan
          app.use(errorMiddleware.serverRoute())
          app.use(errorMiddleware.serverError())

          app.listen(PORT, () => {
               console.log(`Server is running on http://localhost:${PORT}`)
          })

     } catch (error){
          console.log(error)
     }
}

init();

